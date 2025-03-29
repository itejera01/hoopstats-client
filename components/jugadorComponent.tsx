import { Colors } from '@/constants/Colors';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const numStatsColumns = 2;
export default function JugadorComponent(
  { nombre, equipo, torneo, edad, posicion }:
    {
      nombre: string,
      equipo: string,
      torneo: string,
      edad: number,
      posicion: string,
    }) {
  const [showStats, setShowStats] = useState(false);
  const [partidos, setPartidos] = useState<any[]>([]);

  // Cargar los partidos desde AsyncStorage
  React.useEffect(() => {
    const fetchPartidos = async () => {
      const storedPartidos = await AsyncStorage.getItem("partidosJugados");
      if (storedPartidos) {
        try {
          const parsedPartidos = JSON.parse(storedPartidos);
          if (Array.isArray(parsedPartidos)) {
            setPartidos(parsedPartidos);
            console.log("Partidos cargados:", parsedPartidos);
          } else {
            setPartidos([]); // Si no es un arreglo, inicializar como un arreglo vacío
          }
        } catch (error) {
          console.error("Error al parsear partidos:", error);
          setPartidos([]); // En caso de error en el parseo, inicializar como vacío
        }
      } else {
        setPartidos([]); // Si no hay partidos en AsyncStorage, inicializar como vacío
      }
    };
    fetchPartidos();
  }, []);

  // Calcular las estadísticas solo cuando los partidos cambian
  const data = React.useMemo(() => {
    if (partidos.length === 0) return []; // Si no hay partidos, no calcular estadísticas

    return [
      {
        label: 'MIN/P',
        value: (partidos.reduce((acc: number, partido: any) => acc + (Number(partido.tiempoJugado?.minutes) || 0), 0) / partidos.length).toFixed(1),
      },
      {
        label: 'PTS/P',
        value: (partidos.reduce((acc: number, partido: any) => {
          return acc + (Number(partido.dosPuntosEmbocados) || 0) * 2
            + (Number(partido.tresPuntosEmbocados) || 0) * 3
            + (Number(partido.tirosLibresEmbocados) || 0);
        }, 0) / partidos.length).toFixed(1),
      },
      {
        label: 'TC%',
        value: (() => {
          const totalIntentados = partidos.reduce((acc: number, partido: any) => acc + (partido.dosPuntosIntentados || 0) + (partido.tresPuntosIntentados || 0), 0);
          const totalEmbocados = partidos.reduce((acc: number, partido: any) => acc + (partido.dosPuntosEmbocados || 0) + (partido.tresPuntosEmbocados || 0), 0);
          return totalIntentados > 0
            ? `${((totalEmbocados / totalIntentados) * 100).toFixed(1)}%`
            : '00.0%';
        })(),
      },
      {
        label: '2PTS%',
        value: (() => {
          const totalIntentados = partidos.reduce((acc: number, partido: any) => acc + (partido.dosPuntosIntentados || 0), 0);
          const totalEmbocados = partidos.reduce((acc: number, partido: any) => acc + (partido.dosPuntosEmbocados || 0), 0);
          return totalIntentados > 0
            ? `${((totalEmbocados / totalIntentados) * 100).toFixed(1)}%`
            : '00.0%';
        })(),
      },
      {
        label: '3PTS%',
        value: (() => {
          const totalIntentados = partidos.reduce((acc: number, partido: any) => acc + (partido.tresPuntosIntentados || 0), 0);
          const totalEmbocados = partidos.reduce((acc: number, partido: any) => acc + (partido.tresPuntosEmbocados || 0), 0);
          return totalIntentados > 0
            ? `${((totalEmbocados / totalIntentados) * 100).toFixed(1)}%`
            : '00.0%';
        })(),
      },
      {
        label: 'TL%',
        value: (() => {
          const totalIntentados = partidos.reduce((acc: number, partido: any) => acc + (partido.tirosLibresIntentados || 0), 0);
          const totalEmbocados = partidos.reduce((acc: number, partido: any) => acc + (partido.tirosLibresEmbocados || 0), 0);
          return totalIntentados > 0
            ? `${((totalEmbocados / totalIntentados) * 100).toFixed(1)}%`
            : '00.0%';
        })(),
      },
      {
        label: 'FC/P',
        value: (partidos.reduce((acc: number, partido: any) => acc + (Number(partido.faltasCometidas) || 0), 0) / partidos.length).toFixed(1),
      },
      {
        label: 'ASI/P',
        value: (partidos.reduce((acc: number, partido: any) => acc + (Number(partido.asistencias) || 0), 0) / partidos.length).toFixed(1),
      },
      {
        label: 'TAP/P',
        value: (partidos.reduce((acc: number, partido: any) => acc + (Number(partido.tapones) || 0), 0) / partidos.length).toFixed(1),
      },
      {
        label: 'REB/P',
        value: (partidos.reduce((acc: number, partido: any) => acc + (Number(partido.rebotes) || 0), 0) / partidos.length).toFixed(1),
      },
      {
        label: 'ROB/P',
        value: (partidos.reduce((acc: number, partido: any) => acc + (Number(partido.robos) || 0), 0) / partidos.length).toFixed(1),
      },
      {
        label: 'EFI',
        value: (partidos.reduce((acc: number, partido: any) => {
          const puntos = (Number(partido.dosPuntosEmbocados) || 0) * 2
            + (Number(partido.tresPuntosEmbocados) || 0) * 3
            + (Number(partido.tirosLibresEmbocados) || 0);
          const rebotes = Number(partido.rebotes) || 0;
          const asistencias = Number(partido.asistencias) || 0;
          const robos = Number(partido.robos) || 0;
          const tapones = Number(partido.tapones) || 0;

          const tirosCampoFallados = (Number(partido.dosPuntosIntentados) || 0)
            + (Number(partido.tresPuntosIntentados) || 0) -
            ((Number(partido.dosPuntosEmbocados) || 0) + (Number(partido.tresPuntosEmbocados) || 0));

          const tirosLibresFallados = (Number(partido.tirosLibresIntentados) || 0) - (Number(partido.tirosLibresEmbocados) || 0);
          const perdidas = Number(partido.perdidas) || 0;
          const faltasRealizadas = Number(partido.faltasCometidas) || 0;

          const eficiencia = (puntos + rebotes + asistencias + robos + tapones)
            - (tirosCampoFallados + tirosLibresFallados + perdidas + faltasRealizadas);

          return acc + eficiencia;
        }, 0) / partidos.length).toFixed(1),
      },
    ];
  }, [partidos]); // Solo recalcular cuando `partidos` cambia






  const renderStats = ({ item }: { item: { label: string; value: number | string } }) => {
    return (
      <View style={styles.stats}>
        <Text style={[styles.text, styles.statsText]}>{item.label}: {item.value}</Text>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.infoJugador} onPress={() => setShowStats(!showStats)}>
        <View style={styles.imageContainer}>
          <Text style={styles.text}>(escudo)</Text>
        </View>
        <View>
          <Text style={[styles.text, styles.nombre]}>{nombre}</Text>
          <Text style={[styles.text, styles.datosEquipo]}>{torneo}</Text>
          <Text style={[styles.text, styles.datosEquipo]}>{equipo}</Text>
          <Text style={[styles.text, styles.edad]}>{edad} años - {posicion}</Text>
        </View>
      </TouchableOpacity>
      {showStats && (
        <View style={styles.statsContainer}>
          <FlatList
            data={data}
            renderItem={renderStats}
            numColumns={numStatsColumns}
            keyExtractor={(item, index) => index.toString()} // Esto asigna una clave única
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.menuBackground,
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 25,
  },
  infoJugador: {
    flexDirection: 'row',
    backgroundColor: Colors.menuBackground,
    height: 'auto',
    borderRadius: 15,
    padding: 15,
  },
  imageContainer: {
    height: 100,
    width: 100,
    borderRadius: 15,
    borderColor: Colors.appBackground,
    borderWidth: 2,
    marginRight: 15,
    // TEMPORAL
    alignItems: 'center',
    justifyContent: 'center',
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  datosEquipo: {
    fontSize: 16,
  },
  edad: {
    fontSize: 14,
  },
  partidosJugados: {
    color: Colors.buttonBackground,
    fontWeight: 'bold',
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: 'regular',
    color: Colors.text,
    margin: 2,
  },
  statsContainer: {
    backgroundColor: Colors.menuBackground,
    height: 'auto',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    width: '100%',
  },
  stats: {
    borderBottomWidth: 1,
    borderColor: Colors.text,
    height: 50,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
})



