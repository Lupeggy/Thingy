// src/screens/DrawScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, PanResponder, Dimensions, Image, Alert,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { colors, space, radius } from '../theme';

const { width } = Dimensions.get('window');
const PEN_COLORS = ['#1a1a1a','#c0392b','#2471a3','#1e8449','#7d3c98','#d4813a','#ffffff'];
const PEN_SIZES  = [2, 5, 10, 18];

// ─── Observe Timer ────────────────────────────────────────────────────────────
function ObserveTimer({ seconds, onDone }) {
  const [left, setLeft] = useState(seconds);
  const progress = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue:0, duration:seconds*1000, useNativeDriver:false }).start();
    const iv = setInterval(() => {
      setLeft(l => {
        if (l <= 1) { clearInterval(iv); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onDone(); return 0; }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);
  const barWidth = progress.interpolate({ inputRange:[0,1], outputRange:['0%','100%'] });
  return (
    <View style={obs.root}>
      <Text style={obs.label}>observe first</Text>
      <Text style={obs.count}>{left}</Text>
      <Text style={obs.unit}>seconds</Text>
      <View style={obs.track}><Animated.View style={[obs.fill,{width:barWidth}]}/></View>
      <Text style={obs.sub}>look at it slowly.{'\n'}then we draw.</Text>
    </View>
  );
}
const obs = StyleSheet.create({
  root:  { flex:1, alignItems:'center', justifyContent:'center', padding:40 },
  label: { fontSize:11, textTransform:'uppercase', letterSpacing:1.2, color:'rgba(26,26,26,0.35)', marginBottom:24 },
  count: { fontSize:80, fontWeight:'900', color:colors.ink, lineHeight:80 },
  unit:  { fontSize:14, color:'rgba(26,26,26,0.4)', marginBottom:28 },
  track: { width:'100%', height:3, backgroundColor:'rgba(26,26,26,0.1)', borderRadius:2, overflow:'hidden', marginBottom:28 },
  fill:  { height:'100%', backgroundColor:colors.ink, borderRadius:2 },
  sub:   { fontSize:15, color:'rgba(26,26,26,0.45)', textAlign:'center', lineHeight:24 },
});

// ─── Speed Bar ────────────────────────────────────────────────────────────────
function SpeedBar({ seconds, onDone }) {
  const [left, setLeft] = useState(seconds);
  const progress = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue:0, duration:seconds*1000, useNativeDriver:false }).start();
    const iv = setInterval(() => {
      setLeft(l => {
        if (l <= 1) { clearInterval(iv); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); onDone(); return 0; }
        if (l <= 10) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);
  const barWidth = progress.interpolate({ inputRange:[0,1], outputRange:['0%','100%'] });
  const mins = String(Math.floor(left/60)).padStart(2,'0');
  const secs = String(left%60).padStart(2,'0');
  return (
    <View style={sp.root}>
      <Text style={[sp.timer, left<10 && {color:'#c0392b'}]}>{mins}:{secs}</Text>
      <View style={sp.track}><Animated.View style={[sp.fill,{width:barWidth, backgroundColor:left<10?'#c0392b':colors.ink}]}/></View>
    </View>
  );
}
const sp = StyleSheet.create({
  root:  { flexDirection:'row', alignItems:'center', gap:12, paddingHorizontal:16, paddingVertical:8 },
  timer: { fontSize:18, fontWeight:'800', color:colors.ink, minWidth:52 },
  track: { flex:1, height:3, backgroundColor:'rgba(26,26,26,0.1)', borderRadius:2, overflow:'hidden' },
  fill:  { height:'100%', borderRadius:2 },
});

// ─── Canvas ───────────────────────────────────────────────────────────────────
function NativeCanvas({ onSave, speedSeconds }) {
  const [strokes, setStrokes]   = useState([]);
  const liveStroke              = useRef(null);
  const [tick, setTick]         = useState(0); // force re-render while drawing
  const [penColor, setPenColor] = useState('#1a1a1a');
  const [penSize, setPenSize]   = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [speedDone, setSpeedDone] = useState(false);
  const layout = useRef({ pageX:0, pageY:0 });

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderGrant: (e) => {
      const { pageX, pageY } = e.nativeEvent;
      liveStroke.current = {
        points: [[pageX - layout.current.pageX, pageY - layout.current.pageY]],
        color:  isEraser ? '#fdf9f3' : penColor,
        size:   isEraser ? penSize * 3 : penSize,
      };
      setHasDrawn(true);
      setTick(t => t + 1);
    },
    onPanResponderMove: (e) => {
      if (!liveStroke.current) return;
      const { pageX, pageY } = e.nativeEvent;
      liveStroke.current.points.push([pageX - layout.current.pageX, pageY - layout.current.pageY]);
      setTick(t => t + 1);
    },
    onPanResponderRelease: () => {
      if (!liveStroke.current) return;
      setStrokes(prev => [...prev, { ...liveStroke.current, points: [...liveStroke.current.points] }]);
      liveStroke.current = null;
      setTick(t => t + 1);
    },
  })).current;

  function toPath(points) {
    if (!points || points.length === 0) return '';
    if (points.length === 1) return `M ${points[0][0]-0.1} ${points[0][1]} L ${points[0][0]+0.1} ${points[0][1]}`;
    return `M ${points[0][0]} ${points[0][1]} ` + points.slice(1).map(p => `L ${p[0]} ${p[1]}`).join(' ');
  }

  function clear() {
    setStrokes([]); liveStroke.current = null; setHasDrawn(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  const all = liveStroke.current ? [...strokes, liveStroke.current] : strokes;

  return (
    <View style={{flex:1}}>
      {speedSeconds && !speedDone && <SpeedBar seconds={speedSeconds} onDone={() => setSpeedDone(true)} />}
      {speedDone && <View style={cv.timesUp}><Text style={cv.timesUpText}>time's up — finish your line</Text></View>}

      {/* Toolbar */}
      <View style={cv.toolbar}>
        <View style={cv.row}>
          {PEN_COLORS.map(c => (
            <TouchableOpacity key={c} onPress={() => { setPenColor(c); setIsEraser(false); }}
              style={[cv.colorBtn, {backgroundColor:c}, penColor===c && !isEraser && cv.colorSel]}/>
          ))}
        </View>
        <View style={cv.row}>
          {PEN_SIZES.map(sz => (
            <TouchableOpacity key={sz} onPress={() => { setPenSize(sz); setIsEraser(false); }}
              style={[cv.sizeBtn, penSize===sz && !isEraser && cv.sizeSel]}>
              <View style={{width:Math.min(sz+2,20), height:Math.min(sz+2,20), borderRadius:99, backgroundColor:isEraser?'#bbb':penColor}}/>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setIsEraser(e=>!e)} style={[cv.chip, isEraser && cv.chipOn]}>
            <Text style={{fontSize:13, color:isEraser?'#fff':'rgba(26,26,26,0.5)'}}>⌫</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clear} style={cv.chip}>
            <Text style={{fontSize:12, color:'rgba(26,26,26,0.4)'}}>clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SVG drawing surface */}
      <View
        style={cv.canvas}
        onLayout={e => {
          e.target.measure((_x,_y,_w,_h,px,py) => { layout.current = { pageX:px, pageY:py }; });
        }}
        {...pan.panHandlers}
      >
        <Svg width="100%" height="100%">
          <Rect x="0" y="0" width="100%" height="100%" fill="#fdf9f3"/>
          {all.map((s,i) => (
            <Path key={i} d={toPath(s.points)} stroke={s.color} strokeWidth={s.size}
              strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          ))}
        </Svg>
      </View>

      <View style={cv.saveRow}>
        <TouchableOpacity style={[cv.saveBtn, !hasDrawn && cv.saveBtnOff]} onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onSave({type:'canvas',uri:null}); }} disabled={!hasDrawn}>
          <Text style={[cv.saveTxt, !hasDrawn && {color:'rgba(26,26,26,0.3)'}]}>done →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const cv = StyleSheet.create({
  toolbar:  { backgroundColor:'rgba(26,26,26,0.04)', paddingHorizontal:14, paddingVertical:8, gap:8 },
  row:      { flexDirection:'row', gap:6, alignItems:'center', flexWrap:'wrap' },
  colorBtn: { width:26, height:26, borderRadius:13, borderWidth:1.5, borderColor:'rgba(26,26,26,0.15)' },
  colorSel: { borderWidth:3, borderColor:'#444', transform:[{scale:1.15}] },
  sizeBtn:  { width:34, height:34, borderRadius:8, backgroundColor:'rgba(26,26,26,0.05)', alignItems:'center', justifyContent:'center' },
  sizeSel:  { backgroundColor:'rgba(26,26,26,0.18)' },
  chip:     { paddingHorizontal:10, paddingVertical:6, borderRadius:8, backgroundColor:'rgba(26,26,26,0.06)' },
  chipOn:   { backgroundColor:'#1a1a1a' },
  canvas:   { flex:1, marginHorizontal:14, borderRadius:12, overflow:'hidden', backgroundColor:'#fdf9f3' },
  timesUp:  { paddingHorizontal:16, paddingVertical:6, backgroundColor:'rgba(192,57,43,0.08)' },
  timesUpText:{ fontSize:12, color:'#c0392b', textAlign:'center' },
  saveRow:  { paddingHorizontal:14, paddingTop:10, paddingBottom:4 },
  saveBtn:  { backgroundColor:'#1a1a1a', borderRadius:14, paddingVertical:16, alignItems:'center' },
  saveBtnOff:{ backgroundColor:'rgba(26,26,26,0.1)' },
  saveTxt:  { color:'#f5f0e8', fontSize:15, fontWeight:'700' },
});

// ─── Upload View ──────────────────────────────────────────────────────────────
function UploadView({ prompt, onDone, onSkip }) {
  const [preview, setPreview] = useState(null);

  async function pick(useCamera) {
    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Camera needed', 'Allow camera access in Settings.'); return; }
      const r = await ImagePicker.launchCameraAsync({ quality:0.8, allowsEditing:true });
      if (!r.canceled) setPreview(r.assets[0].uri);
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Photos needed', 'Allow photos access in Settings.'); return; }
      const r = await ImagePicker.launchImageLibraryAsync({ quality:0.8, allowsEditing:true });
      if (!r.canceled) setPreview(r.assets[0].uri);
    }
  }

  return (
    <View style={up.root}>
      <View style={up.promptWrap}>
        <Text style={up.promptText}>{prompt.text}</Text>
        <Text style={up.hintText}>{prompt.hint}</Text>
      </View>
      {preview ? (
        <View style={{gap:12}}>
          <Image source={{uri:preview}} style={up.preview}/>
          <TouchableOpacity style={up.doneBtn} onPress={() => onDone({type:'photo',uri:preview})}>
            <Text style={up.doneTxt}>done →</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPreview(null)}>
            <Text style={up.retry}>use a different photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{gap:12}}>
          <TouchableOpacity style={up.photoBtn} onPress={() => pick(true)}>
            <Text style={{fontSize:18}}>📷</Text>
            <Text style={up.photoBtnTxt}>take a photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[up.photoBtn,{backgroundColor:'rgba(26,26,26,0.08)'}]} onPress={() => pick(false)}>
            <Text style={[up.photoBtnTxt,{color:colors.ink}]}>choose from library</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSkip}>
            <Text style={up.skip}>skip — just save the card</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const up = StyleSheet.create({
  root:       { flex:1, paddingHorizontal:24, paddingBottom:40 },
  promptWrap: { flex:1, justifyContent:'center', paddingBottom:16 },
  promptText: { fontSize:30, fontWeight:'900', color:colors.ink, lineHeight:38, letterSpacing:-0.5, marginBottom:12 },
  hintText:   { fontSize:14, color:colors.inkLight, fontStyle:'italic' },
  preview:    { width:'100%', height:240, borderRadius:16, resizeMode:'cover' },
  doneBtn:    { backgroundColor:colors.ink, borderRadius:14, paddingVertical:16, alignItems:'center' },
  doneTxt:    { color:'#f5f0e8', fontSize:15, fontWeight:'700' },
  retry:      { textAlign:'center', color:colors.inkLight, fontSize:13, paddingVertical:8 },
  photoBtn:   { backgroundColor:colors.ink, borderRadius:14, paddingVertical:16, alignItems:'center', flexDirection:'row', justifyContent:'center', gap:8 },
  photoBtnTxt:{ color:'#f5f0e8', fontSize:15, fontWeight:'700' },
  skip:       { textAlign:'center', color:'rgba(26,26,26,0.3)', fontSize:13, paddingVertical:10 },
});

// ─── Draw Screen ──────────────────────────────────────────────────────────────
export default function DrawScreen({ prompt, onComplete, onBack }) {
  const [phase, setPhase]       = useState(prompt.timing?.type === 'observe' ? 'observe' : 'canvas');
  const [drawMode, setDrawMode] = useState('canvas');

  return (
    <View style={ds.root}>
      <View style={ds.topBar}>
        <TouchableOpacity onPress={onBack}><Text style={ds.back}>← back</Text></TouchableOpacity>
        {phase !== 'observe' && (
          <TouchableOpacity onPress={() => setDrawMode(m => m==='canvas'?'upload':'canvas')}>
            <Text style={ds.switch}>{drawMode==='canvas' ? 'drew on paper? →' : '← draw in-app'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {phase !== 'observe' && drawMode === 'canvas' && (
        <View style={ds.promptStrip}>
          <Text style={ds.promptText} numberOfLines={2}>{prompt.text}</Text>
          <Text style={ds.hintText}>{prompt.hint}</Text>
        </View>
      )}

      {phase === 'observe' && <ObserveTimer seconds={prompt.timing.seconds} onDone={() => setPhase('canvas')}/>}
      {phase !== 'observe' && drawMode === 'canvas' && (
        <NativeCanvas onSave={r => onComplete({drawingType:'canvas', uri:r.uri})} speedSeconds={prompt.timing?.type==='speed'?prompt.timing.seconds:null}/>
      )}
      {phase !== 'observe' && drawMode === 'upload' && (
        <UploadView prompt={prompt} onDone={r => onComplete({drawingType:'photo', uri:r.uri})} onSkip={() => onComplete({drawingType:null, uri:null})}/>
      )}
    </View>
  );
}

const ds = StyleSheet.create({
  root:        { flex:1, backgroundColor:'#fdf9f3' },
  topBar:      { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:16, paddingTop:56, paddingBottom:8 },
  back:        { fontSize:14, color:colors.inkLight },
  switch:      { fontSize:12, color:colors.inkLight, textDecorationLine:'underline' },
  promptStrip: { paddingHorizontal:16, paddingBottom:10, borderBottomWidth:1, borderBottomColor:colors.border, marginBottom:8 },
  promptText:  { fontSize:15, fontWeight:'700', color:colors.ink, lineHeight:22 },
  hintText:    { fontSize:12, color:colors.inkLight, fontStyle:'italic', marginTop:3 },
});
