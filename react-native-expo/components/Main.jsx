import { useEffect, useState, useMemo } from 'react';
import { FlatList, View, ActivityIndicator, TextInput, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Player } from './Player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPlayers } from '../service/players';

export function Main() {
  const [players, setPlayers] = useState([]);
  const [nameQuery, setNameQuery] = useState('');
  const [minHeight, setMinHeight] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('Todas');
  const [showPosModal, setShowPosModal] = useState(false);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const load = async () => {
      const data = await getPlayers();
      setPlayers(data);
    };
    load();
  }, []);

  // Obtener posiciones únicas para el selector
  const positions = useMemo(() => {
    const set = new Set();
    players.forEach(p => { if (p.posicion) set.add(p.posicion); });
    return ['Todas', ...Array.from(set)];
  }, [players]);

  // Lista filtrada
  const filteredPlayers = useMemo(() => {
    return players.filter(p => {
      if (nameQuery && !`${p.nombre} ${p.apellidos}`.toLowerCase().includes(nameQuery.toLowerCase()))
        return false;
      if (minHeight) {
        const h = Number(minHeight);
        if (!isNaN(h) && Number(p.altura) < h) return false;
      }
      if (selectedPosition && selectedPosition !== 'Todas' && p.posicion !== selectedPosition)
        return false;
      return true;
    });
  }, [players, nameQuery, minHeight, selectedPosition]);

  return (
    <View style={{ flex: 1 }}>
      {/* Inputs de filtro */}
      <View style={styles.filtersContainer}>
        <TextInput
          placeholder="Buscar por nombre"
          value={nameQuery}
          onChangeText={setNameQuery}
          style={[styles.input, { marginRight: 8 }]}
        />
        <TextInput
          placeholder="Altura mínima"
          value={minHeight}
          onChangeText={setMinHeight}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity style={styles.posSelector} onPress={() => setShowPosModal(true)}>
          <Text style={styles.posSelectorText}>{selectedPosition || 'Todas'}</Text>
          <Text style={styles.posSelectorArrow}>▾</Text>
        </TouchableOpacity>
      </View>

      {players.length === 0 ? (
        <ActivityIndicator color={"#fff"} size={"large"} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredPlayers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Player item={item} />}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        />
      )}

      {/* Modal de posiciones */}
      <Modal visible={showPosModal} transparent animationType="fade" onRequestClose={() => setShowPosModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowPosModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por posición</Text>
            <FlatList
              data={positions}
              keyExtractor={(i) => i}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, item === selectedPosition && styles.modalItemActive]}
                  onPress={() => {
                    setSelectedPosition(item);
                    setShowPosModal(false);
                  }}
                >
                  <Text style={[styles.modalItemText, item === selectedPosition && styles.modalItemTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  posSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  posSelectorText: { color: '#333', fontWeight: '600' },
  posSelectorArrow: { color: '#333', marginLeft: 8 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
  },
  modalItemActive: { backgroundColor: '#1FB28A' },
  modalItemText: { color: '#333' },
  modalItemTextActive: { color: '#fff' },
});
