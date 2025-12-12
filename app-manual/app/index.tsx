import React, {useState, useEffect} from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import axiosInstance from '../axiosConfig.js';


const getStatusStyles = (status) => {
  switch (status) {
    case 'Operational': return 'bg-green-100 text-green-700 border-green-300';
    case 'Low Battery': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'Offline': return 'bg-red-100 text-red-700 border-red-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

/**
 * Individual Card Component for a single device metric.
 */
const MetricCard = ({ title, value, unit, iconName, color }) => (
  <View className={`w-1/2 p-2`}>
    <View className={`flex-row items-center p-3 rounded-xl shadow-sm border border-gray-100 ${color}`}>
      <MaterialCommunityIcons name={iconName} size={24} color="#374151" />
      <View className="ml-3">
        <Text className="text-lg font-bold text-gray-800">{value}{unit}</Text>
        <Text className="text-xs text-gray-500">{title}</Text>
      </View>
    </View>
  </View>
);

/**
 * Device Card Component
 */
const DeviceCard = ({ device }) => {
  console.log(JSON.stringify(device));
  const tankLevel = device.tankLevel;
  const humidity=device.humidity;
  const isOnline=device.isOnline;
  const temperature = device.temperature;
  const soilMoisture=device.soilMoisture;
  const deviceID=device.deviceID;
  const statusClasses = getStatusStyles(status);

  return (
    <TouchableOpacity 
      className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-md border border-gray-100 active:bg-gray-50"
      onPress={() => console.log(`Device ${name} tapped`)} // Action when device is tapped
      activeOpacity={0.8}
    >
      {/* Header and Status */}
      <View className="flex-row justify-between items-start pb-3 mb-3 border-b border-gray-100">
        <View className="flex-shrink">
          <Text className="text-xl font-extrabold text-gray-900">{deviceID}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full border ${statusClasses}`}>
        </View>
      </View>

      {/* Metrics Section (2x2 Grid) */}
      <View className="flex-row flex-wrap -m-2">
        <MetricCard 
          title="Humidity" 
          value={humidity} 
          unit="%" 
          iconName="water-percent" 
          color="bg-blue-50" 
        />
        <MetricCard 
          title="Temperature" 
          value={temperature} 
          unit="°C" 
          iconName="temperature-celsius" 
          color="bg-red-50" 
        />
        <MetricCard 
          title="Tank Level" 
          value={tankLevel} 
          unit="%" 
          iconName="water-boiler" 
          color="bg-cyan-50" 
        />
        <MetricCard 
          title="Soil Moisture" 
          value={soilMoisture} 
          unit=" raw" 
          iconName="spa" 
          color="bg-amber-50" 
        />
      </View>
      
    </TouchableOpacity>
  );
};

/**
 * Main Dashboard Component (The entire screen)
 */
const IrrigationDashboard = () => {
  const [data, setData] = useState([]);
  
  useEffect(()=>{
    const func=async()=>{
      try{
        const response = await axiosInstance.get("/device/get");
        if(!response.data.success){
            console.log(JSON.stringify(response.data.message));
            setData([]);
        }else{
            setData(response.data.data);
            console.log(JSON.stringify(response.data));
        }
      }catch(error){
        console.error("Data retrieval error:", error.message);
      }
    }

    func();
  },[]);

  const Header = () => (
    <View className="p-4 bg-white shadow-sm border-b border-gray-100">
      <Text className="text-3xl font-extrabold text-green-700">Dashboard</Text>
      <Text className="text-base text-gray-500">Irrigation System Overview</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar style="dark" />
      
      {/* Render the simple header */}
      <Header />

      {/* FlatList for efficient, scrollable list of devices */}
      {data !== null && <FlatList
        data={data}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <DeviceCard device={item} />}
        contentContainerStyle={{ paddingBottom: 16 }} // Space at the bottom
      />} 
    </SafeAreaView>
  );
};

export default IrrigationDashboard;