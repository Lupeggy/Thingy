// src/screens/DrawScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { colors, space, radius } from '../theme';

const { width, height } = Dimensions.get('window');

// ─── Observe Timer (countdown BEFORE drawing) ─────────────────────────────────
function ObserveTimer({ seconds, onDone }) {
  const [left, setLeft] = useState(seconds);
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: seconds * 1000,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      setLeft(l => {
        if (l <= 1) {
          clearInterval(interval);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onDone();
          return 0;
        }
        return l - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={obs.root}>
      <Text style={obs.label}>observe first</Text>
      <Text style={obs.count}>{left}</Text>
      <Text style={obs.unit}>seconds</Text>
      <View style={obs.track}>
        <Animated.View style={[obs.fill, { width: barWidth }]} />
      </View>
      <Text style={obs.sub}>look at it slowly.{'\n'}then we draw.</Text>
    </View>
  );
}

const obs = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  label: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: 'rgba(26,26,26,0.35)', marginBottom: 24 },
  count: { fontSize: 80, fontWeight: '900', color: colors.ink, lineHeight: 80, fontFamily: 'serif' },
  unit:  { fontSize: 14, color: 'rgba(26,26,26,0.4)', marginBottom: 28 },
  track: { width: '100%', height: 3, backgroundColor: 'rgba(26,26,26,0.1)', borderRadius: 2, overflow: 'hidden', marginBottom: 28 },
  fill:  { height: '100%', backgroundColor: colors.ink, borderRadius: 2 },
  sub:   { fontSize: 15, color: 'rgba(26,26,26,0.45)', textAlign: 'center', lineHeight: 24 },
});

// ─── Speed Timer (countdown WHILE drawing) ────────────────────────────────────
function SpeedBar({ seconds, onDone }) {
  const [left, setLeft] = useState(seconds);
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: seconds * 1000,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      setLeft(l => {
        if (l <= 1) {
          clearInterval(interval);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          onDone();
          return 0;
        }
        if (l <= 10) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return l - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const mins = String(Math.floor(left / 60)).padStart(2, '0');
  const secs = String(left % 60).padStart(2, '0');

  return (
    <View style={sp.root}>
      <Text style={sp.timer}>{mins}:{secs}</Text>
      <View style={sp.track}>
        <Animated.View style={[sp.fill, { width: barWidth, backgroundColor: left < 10 ? '#c0392b' : colors.ink }]} />
      </View>
    </View>
  );
}

const sp = StyleSheet.create({
  root:  { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: space.md, paddingVertical: 8 },
  timer: { fontSize: 18, fontWeight: '800', color: colors.ink, fontFamily: 'serif', minWidth: 52 },
  track: { flex: 1, height: 3, backgroundColor: 'rgba(26,26,26,0.1)', borderRadius: 2, overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 2 },
});

// ─── Simple Native Canvas (PanResponder-based) ────────────────────────────────
// For production, swap this with react-native-skia for buttery smooth strokes.
// This works in Expo Go without any native build.
import { PanResponder, Image as RNImage } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const PEN_COLORS_LIST = ['#1a1a1a','#c0392b','#2471a3','#1e8449','#7d3c98','#d4813a','#ffffff'];
const PEN_SIZES_LIST  = [2, 5, 10, 18];

function NativeCanvas({ onSave, speedSeconds, onSpeedDone }) {
  const [paths, setPaths]       = useState([]);
  const [currentPath, setCurrentPath] = useState(null);
  const [penColor, setPenColor] = useState('#1a1a1a');
  const [penSize, setPenSize]   = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [speedDone, setSpeedDone] = useState(false);

  const canvasRef = useRef({ width: 0, height: 0, x: 0, y: 0 });

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      const { locationX, locationY } = e.nativeEvent;
      const newPath = {
        points: [`M ${locationX} ${locationY}`],
        color: isEraser ? colors.bgCard : penColor,
        size: isEraser ? penSize * 3 : penSize,
      };
      setCurrentPath(newPath);
      setHasDrawn(true);
    },
    onPanResponderMove: (e) => {
      const { locationX, locationY } = e.nativeEvent;
      setCurrentPath(p => p ? {
        ...p,
        points: [...p.points, `L ${locationX} ${locationY}`],
      } : null);
    },
    onPanResponderRelease: () => {
      if (currentPath) {
        setPaths(ps => [...ps, currentPath]);
        setCurrentPath(null);
      }
    },
  })).current;

  function handleSpeedDone() {
    setSpeedDone(true);
    onSpeedDone?.();
  }

  function clearCanvas() {
    setPaths([]);
    setCurrentPath(null);
    setHasDrawn(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  // For now, capture as SVG description (in production use react-native-view-shot)
  function handleSave() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Pass a signal that drawing was done in-app (no actual image in Expo Go without view-shot)
    onSave({ type: 'canvas', hasContent: hasDrawn });
  }

  const allPaths = currentPath ? [...paths, currentPath] : paths;

  return (
    <View style={{ flex: 1 }}>
      {/* Speed timer bar */}
      {speedSeconds && !speedDone && (
        <SpeedBar seconds={speedSeconds} onDone={handleSpeedDone} />
      )}
      {speedDone && (
        <View style={cv.timesUp}>
          <Text style={cv.timesUpText}>time's up — finish your line</Text>
        </View>
      )}

      {/* Toolbar */}
      <View style={cv.toolbar}>
        <View style={cv.toolRow}>
          {PEN_COLORS_LIST.map(c => (
            <TouchableOpacity
              key={c}
              onPress={() => { setPenColor(c); setIsEraser(false); }}
              style={[
                cv.colorBtn,
                { backgroundColor: c, borderWidth: penColor === c && !isEraser ? 2.5 : 1 },
                penColor === c && !isEraser && cv.colorBtnActive,
              ]}
            />
          ))}
        </View>
        <View style={cv.toolRow}>
          {PEN_SIZES_LIST.map(sz => (
            <TouchableOpacity
              key={sz}
              onPress={() => { setPenSize(sz); setIsEraser(false); }}
              style={[cv.sizeBtn, penSize === sz && !isEraser && cv.sizeBtnActive]}
            >
              <View style={{
                width: Math.min(sz + 2, 18),
                height: Math.min(sz + 2, 18),
                borderRadius: 99,
                backgroundColor: isEraser ? '#ccc' : penColor,
              }} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setIsEraser(e => !e)}
            style={[cv.toolChip, isEraser && cv.toolChipActive]}
          >
            <Text style={{ fontSize: 13, color: isEraser ? colors.ink : 'rgba(26,26,26,0.45)' }}>⌫</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearCanvas} style={cv.toolChip}>
            <Text style={{ fontSize: 12, color: 'rgba(26,26,26,0.4)' }}>clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Drawing area */}
      <View style={cv.canvasWrap} {...panResponder.panHandlers}>
        <Svg width="100%" height="100%" style={cv.svg}>
          {/* White background */}
          <Path d={`M 0 0 L 5000 0 L 5000 5000 L 0 5000 Z`} fill={colors.bgCard} />
          {allPaths.map((p, i) => (
            <Path
              key={i}
              d={p.points.join(' ')}
              stroke={p.color}
              strokeWidth={p.size}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
        </Svg>
      </View>

      {/* Save */}
      <View style={cv.saveRow}>
        <TouchableOpacity
          style={[cv.saveBtn, !hasDrawn && cv.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!hasDrawn}
        >
          <Text style={[cv.saveBtnText, !hasDrawn && { color: 'rgba(26,26,26,0.3)' }]}>
            done →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const cv = StyleSheet.create({
  toolbar:       { backgroundColor: 'rgba(26,26,26,0.04)', paddingHorizontal: 14, paddingVertical: 8, gap: 8 },
  toolRow:       { flexDirection: 'row', gap: 6, alignItems: 'center' },
  colorBtn:      { width: 22, height: 22, borderRadius: 11, borderColor: 'rgba(26,26,26,0.2)' },
  colorBtnActive:{ borderColor: colors.ink, transform: [{ scale: 1.18 }] },
  sizeBtn:       { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(26,26,26,0.05)', alignItems: 'center', justifyContent: 'center' },
  sizeBtnActive: { backgroundColor: 'rgba(26,26,26,0.14)' },
  toolChip:      { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: 'rgba(26,26,26,0.05)' },
  toolChipActive:{ backgroundColor: 'rgba(26,26,26,0.12)' },
  canvasWrap:    { flex: 1, marginHorizontal: 14, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.bgCard },
  svg:           { flex: 1 },
  timesUp:       { paddingHorizontal: space.md, paddingVertical: 6, backgroundColor: 'rgba(192,57,43,0.08)' },
  timesUpText:   { fontSize: 12, color: '#c0392b', textAlign: 'center' },
  saveRow:       { paddingHorizontal: 14, paddingTop: 10 },
  saveBtn:       { backgroundColor: colors.ink, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center' },
  saveBtnDisabled:{ backgroundColor: 'rgba(26,26,26,0.1)' },
  saveBtnText:   { color: colors.accentFg, fontSize: 15, fontWeight: '700' },
});

// ─── Upload View ──────────────────────────────────────────────────────────────
function UploadView({ prompt, onDone, onSkip }) {
  const [preview, setPreview] = useState(null);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) setPreview(result.assets[0].uri);
  }

  async function takePhoto() {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) setPreview(result.assets[0].uri);
  }

  return (
    <View style={up.root}>
      {/* BIG prompt */}
      <View style={up.promptWrap}>
        <Text style={up.promptText}>{prompt.text}</Text>
        <Text style={up.hintText}>{prompt.hint}</Text>
      </View>

      {/* Upload zone */}
      {preview ? (
        <View style={up.previewWrap}>
          <RNImage source={{ uri: preview }} style={up.preview} />
          <TouchableOpacity style={up.doneBtn} onPress={() => onDone({ type: 'photo', uri: preview })}>
            <Text style={up.doneBtnText}>done →</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPreview(null)}>
            <Text style={up.retryText}>use a different photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={up.actions}>
          <TouchableOpacity style={up.photoBtn} onPress={takePhoto}>
            <Text style={up.photoBtnEmoji}>📷</Text>
            <Text style={up.photoBtnText}>take a photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[up.photoBtn, up.photoBtnAlt]} onPress={pickImage}>
            <Text style={up.photoBtnText}>choose from library</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSkip}>
            <Text style={up.skipText}>skip — just save the card</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const up = StyleSheet.create({
  root:       { flex: 1, paddingHorizontal: space.lg, paddingBottom: space.xl },
  promptWrap: { flex: 1, justifyContent: 'center', paddingBottom: 16 },
  promptText: { fontSize: 30, fontWeight: '900', color: colors.ink, fontFamily: 'serif', lineHeight: 38, letterSpacing: -0.5, marginBottom: 12 },
  hintText:   { fontSize: 14, color: colors.inkLight, fontStyle: 'italic' },
  previewWrap:{ gap: 12 },
  preview:    { width: '100%', height: 240, borderRadius: radius.lg, resizeMode: 'cover' },
  doneBtn:    { backgroundColor: colors.ink, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center' },
  doneBtnText:{ color: colors.accentFg, fontSize: 15, fontWeight: '700' },
  retryText:  { textAlign: 'center', color: colors.inkLight, fontSize: 13, paddingVertical: 8 },
  actions:    { gap: 10 },
  photoBtn:   { backgroundColor: colors.ink, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  photoBtnAlt:{ backgroundColor: 'rgba(26,26,26,0.08)' },
  photoBtnEmoji:{ fontSize: 18 },
  photoBtnText:{ color: colors.accentFg, fontSize: 15, fontWeight: '700' },
  skipText:   { textAlign: 'center', color: 'rgba(26,26,26,0.3)', fontSize: 13, paddingVertical: 10 },
});

// ─── Draw Screen ──────────────────────────────────────────────────────────────
export default function DrawScreen({ prompt, onComplete, onBack }) {
  const [phase, setPhase] = useState(() => {
    // If prompt has observe timer, start with observation
    if (prompt.timing?.type === 'observe') return 'observe';
    return 'canvas';
  });
  const [drawMode, setDrawMode] = useState('canvas'); // 'canvas' | 'upload'

  function handleObserveDone() {
    setPhase('canvas');
  }

  function handleCanvasSave(result) {
    onComplete({ drawingType: 'canvas', thumbnail: null });
  }

  function handleUploadDone(result) {
    onComplete({ drawingType: 'photo', uri: result.uri });
  }

  function handleSkip() {
    onComplete({ drawingType: null, thumbnail: null });
  }

  return (
    <View style={ds.root}>
      {/* Top bar */}
      <View style={ds.topBar}>
        <TouchableOpacity onPress={onBack} style={ds.backBtn}>
          <Text style={ds.backText}>← back</Text>
        </TouchableOpacity>
        {phase === 'canvas' && drawMode === 'canvas' && (
          <TouchableOpacity onPress={() => setDrawMode('upload')}>
            <Text style={ds.switchText}>drew on paper? →</Text>
          </TouchableOpacity>
        )}
        {drawMode === 'upload' && phase !== 'observe' && (
          <TouchableOpacity onPress={() => setDrawMode('canvas')}>
            <Text style={ds.switchText}>draw in-app →</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Prompt strip (canvas mode only) */}
      {phase === 'canvas' && drawMode === 'canvas' && (
        <View style={ds.promptStrip}>
          <Text style={ds.promptText} numberOfLines={2}>{prompt.text}</Text>
          <Text style={ds.hintText}>{prompt.hint}</Text>
        </View>
      )}

      {/* Phase content */}
      {phase === 'observe' && (
        <ObserveTimer seconds={prompt.timing.seconds} onDone={handleObserveDone} />
      )}

      {phase === 'canvas' && drawMode === 'canvas' && (
        <NativeCanvas
          onSave={handleCanvasSave}
          speedSeconds={prompt.timing?.type === 'speed' ? prompt.timing.seconds : null}
          onSpeedDone={() => {}}
        />
      )}

      {phase === 'canvas' && drawMode === 'upload' && (
        <UploadView prompt={prompt} onDone={handleUploadDone} onSkip={handleSkip} />
      )}
    </View>
  );
}

const ds = StyleSheet.create({
  root:        { flex: 1, backgroundColor: colors.bgCard },
  topBar:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.md, paddingTop: 56, paddingBottom: 8 },
  backBtn:     {},
  backText:    { fontSize: 14, color: colors.inkLight },
  switchText:  { fontSize: 12, color: colors.inkLight, textDecorationLine: 'underline' },
  promptStrip: { paddingHorizontal: space.md, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 8 },
  promptText:  { fontSize: 15, fontWeight: '700', color: colors.ink, fontFamily: 'serif', lineHeight: 22 },
  hintText:    { fontSize: 12, color: colors.inkLight, fontStyle: 'italic', marginTop: 3 },
});
