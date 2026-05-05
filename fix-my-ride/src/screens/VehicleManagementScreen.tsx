import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  StatusBar,
  TextInput,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  Plus,
  CheckCircle,
  Edit,
  Trash2,
  Car,
  Shield,
  Clock,
  Calendar,
  Wrench,
  Droplet,
  Smartphone,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const colorOptions = [
  { name: 'Silver', hex: '#c0c0c0' },
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Green', hex: '#10b981' },
];

const initialVehicles = [
  {
    id: '1',
    model: 'Toyota Camry 2020',
    plate: 'ABC-1234',
    color: 'Silver',
    colorHex: '#c0c0c0',
    isActive: true,
    lastService: 'May 1, 2026',
    type: 'Sedan',
  },
  {
    id: '2',
    model: 'Honda Civic 2019',
    plate: 'XYZ-5678',
    color: 'Black',
    colorHex: '#1a1a1a',
    isActive: false,
    lastService: 'Apr 15, 2026',
    type: 'Sedan',
  },
];

export default function VehicleManagementScreen() {
  const navigation = useNavigation<any>();
  
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [formData, setFormData] = useState({
    model: '',
    plate: '',
    color: 'Silver',
    colorHex: '#c0c0c0',
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const formSlideAnim = useRef(new Animated.Value(300)).current;
  const deleteScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();

    loadVehicles();
  }, []);

  useEffect(() => {
    if (showAddForm) {
      Animated.spring(formSlideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }).start();
    } else {
      formSlideAnim.setValue(300);
    }
  }, [showAddForm]);

  const loadVehicles = async () => {
    try {
      const saved = await AsyncStorage.getItem('vehicles');
      if (saved) {
        setVehicles(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Error loading vehicles');
    }
  };

  const saveVehicles = async (newVehicles: typeof vehicles) => {
    try {
      await AsyncStorage.setItem('vehicles', JSON.stringify(newVehicles));
    } catch (error) {
      console.log('Error saving vehicles');
    }
  };

  const handleAddVehicle = useCallback(() => {
    if (!formData.model || !formData.plate) {
      Alert.alert('Required Fields', 'Please fill in all required fields');
      return;
    }

    const newVehicle = {
      id: Date.now().toString(),
      ...formData,
      isActive: vehicles.length === 0,
      lastService: 'Not serviced yet',
      type: 'Sedan',
    };

    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    saveVehicles(updatedVehicles);
    
    setFormData({ model: '', plate: '', color: 'Silver', colorHex: '#c0c0c0' });
    setShowAddForm(false);
    
    Alert.alert('Success', 'Vehicle added successfully!');
  }, [formData, vehicles]);

  const handleEditVehicle = useCallback((vehicle: any) => {
    setEditingVehicle(vehicle);
    setFormData({
      model: vehicle.model,
      plate: vehicle.plate,
      color: vehicle.color,
      colorHex: vehicle.colorHex,
    });
    setShowAddForm(true);
  }, []);

  const handleUpdateVehicle = useCallback(() => {
    if (!editingVehicle) return;

    const updatedVehicles = vehicles.map(v =>
      v.id === editingVehicle.id
        ? { ...v, ...formData }
        : v
    );

    setVehicles(updatedVehicles);
    saveVehicles(updatedVehicles);
    
    setEditingVehicle(null);
    setFormData({ model: '', plate: '', color: 'Silver', colorHex: '#c0c0c0' });
    setShowAddForm(false);
    
    Alert.alert('Success', 'Vehicle updated successfully!');
  }, [editingVehicle, formData, vehicles]);

  const handleDeleteVehicle = useCallback((id: string) => {
    Animated.sequence([
      Animated.spring(deleteScale, {
        toValue: 0.9,
        friction: 3,
        useNativeDriver: false,
      }),
      Animated.spring(deleteScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: false,
      }),
    ]).start();

    Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to remove this vehicle?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedVehicles = vehicles.filter(v => v.id !== id);
            
            // If we deleted the active vehicle, set first vehicle as active
            if (vehicles.find(v => v.id === id)?.isActive && updatedVehicles.length > 0) {
              updatedVehicles[0].isActive = true;
            }
            
            setVehicles(updatedVehicles);
            saveVehicles(updatedVehicles);
            Alert.alert('Success', 'Vehicle removed successfully');
          },
        },
      ]
    );
  }, [vehicles]);

  const handleSetActive = useCallback((id: string) => {
    const updatedVehicles = vehicles.map(v => ({
      ...v,
      isActive: v.id === id,
    }));
    
    setVehicles(updatedVehicles);
    saveVehicles(updatedVehicles);
  }, [vehicles]);

  const handleColorSelect = useCallback((color: typeof colorOptions[0]) => {
    setFormData({ ...formData, color: color.name, colorHex: color.hex });
    setShowColorPicker(false);
  }, [formData]);

  const renderVehicleCard = (vehicle: typeof vehicles[0], index: number) => (
    <Animated.View
      key={vehicle.id}
      style={[
        styles.vehicleCard,
        vehicle.isActive && styles.vehicleCardActive,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 20 * (index + 1)],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={vehicle.isActive ? ['#ffffff', '#f0fdf4'] : ['#ffffff', '#f8fafc']}
        style={styles.vehicleCardGradient}
      >
        {/* Active Badge */}
        {vehicle.isActive && (
          <View style={styles.activeBadge}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.activeBadgeGradient}
            >
              <CheckCircle size={12} color="#ffffff" />
              <Text style={styles.activeBadgeText}>Active</Text>
            </LinearGradient>
          </View>
        )}

        {/* Vehicle Header */}
        <View style={styles.vehicleHeader}>
          {/* Color Indicator */}
          <View style={[styles.colorIndicator, { backgroundColor: vehicle.colorHex }]}>
            <Car size={24} color="#ffffff" />
          </View>

          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleModel}>{vehicle.model}</Text>
            <Text style={styles.vehicleType}>{vehicle.type}</Text>
          </View>

          {/* Set Active Button */}
          {!vehicle.isActive && (
            <TouchableOpacity
              onPress={() => handleSetActive(vehicle.id)}
              style={styles.setActiveButton}
              activeOpacity={0.8}
            >
              <Text style={styles.setActiveText}>Set Active</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Vehicle Details */}
        <View style={styles.vehicleDetails}>
          <View style={styles.detailRow}>
            <Shield size={14} color="#64748b" />
            <Text style={styles.detailLabel}>Plate:</Text>
            <Text style={styles.detailValue}>{vehicle.plate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Droplet size={14} color="#64748b" />
            <Text style={styles.detailLabel}>Color:</Text>
            <View style={styles.colorDot}>
              <View style={[styles.colorDotInner, { backgroundColor: vehicle.colorHex }]} />
            </View>
            <Text style={styles.detailValue}>{vehicle.color}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Clock size={14} color="#64748b" />
            <Text style={styles.detailLabel}>Last Service:</Text>
            <Text style={styles.detailValue}>{vehicle.lastService}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => handleEditVehicle(vehicle)}
            style={styles.editButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#eff6ff', '#dbeafe']}
              style={styles.editButtonGradient}
            >
              <Edit size={16} color="#6366f1" />
              <Text style={styles.editButtonText}>Edit</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteVehicle(vehicle.id)}
            style={styles.deleteButton}
            activeOpacity={0.8}
          >
            <View style={styles.deleteButtonContent}>
              <Trash2 size={16} color="#ef4444" />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <LinearGradient
            colors={['#1e3a8a', '#3b82f6', '#60a5fa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <BlurView intensity={20} tint="light" style={styles.backButtonBlur}>
                  <ChevronLeft size={24} color="#ffffff" />
                </BlurView>
              </TouchableOpacity>
              
              <View style={styles.headerInfo}>
                <Text style={styles.headerTitle}>My Vehicles</Text>
                <Text style={styles.headerSubtitle}>
                  {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered
                </Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <BlurView intensity={20} tint="light" style={styles.statContent}>
                  <Car size={20} color="#ffffff" />
                  <Text style={styles.statNumber}>{vehicles.length}</Text>
                  <Text style={styles.statLabel}>Total</Text>
                </BlurView>
              </View>
              
              <View style={styles.statItem}>
                <BlurView intensity={20} tint="light" style={styles.statContent}>
                  <CheckCircle size={20} color="#ffffff" />
                  <Text style={styles.statNumber}>
                    {vehicles.filter(v => v.isActive).length}
                  </Text>
                  <Text style={styles.statLabel}>Active</Text>
                </BlurView>
              </View>
            </View>
          </LinearGradient>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Vehicle List */}
            {vehicles.map((vehicle, index) => renderVehicleCard(vehicle, index))}

            {/* Add Vehicle Button or Form */}
            {!showAddForm ? (
              <TouchableOpacity
                onPress={() => setShowAddForm(true)}
                style={styles.addButton}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addButtonGradient}
                >
                  <Plus size={22} color="#ffffff" />
                  <Text style={styles.addButtonText}>Add New Vehicle</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <Animated.View
                style={[
                  styles.formCard,
                  {
                    transform: [{ translateY: formSlideAnim }],
                  },
                ]}
              >
                <LinearGradient
                  colors={['#ffffff', '#faf5ff']}
                  style={styles.formGradient}
                >
                  <Text style={styles.formTitle}>
                    {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                  </Text>

                  {/* Model Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Car Model</Text>
                    <View style={styles.inputWrapper}>
                      <Car size={18} color="#94a3b8" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., Toyota Camry 2020"
                        placeholderTextColor="#94a3b8"
                        value={formData.model}
                        onChangeText={(text) => setFormData({ ...formData, model: text })}
                      />
                    </View>
                  </View>

                  {/* Plate Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Plate Number</Text>
                    <View style={styles.inputWrapper}>
                      <Shield size={18} color="#94a3b8" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., ABC-1234"
                        placeholderTextColor="#94a3b8"
                        value={formData.plate}
                        onChangeText={(text) => setFormData({ ...formData, plate: text })}
                        autoCapitalize="characters"
                      />
                    </View>
                  </View>

                  {/* Color Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Color</Text>
                    <TouchableOpacity
                      onPress={() => setShowColorPicker(true)}
                      style={styles.colorSelector}
                    >
                      <View style={[styles.selectedColor, { backgroundColor: formData.colorHex }]} />
                      <Text style={styles.selectedColorText}>{formData.color}</Text>
                      <Text style={styles.changeColorText}>Change</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Color Picker Modal */}
                  {showColorPicker && (
                    <View style={styles.colorPickerContainer}>
                      <Text style={styles.colorPickerTitle}>Select Color</Text>
                      <View style={styles.colorGrid}>
                        {colorOptions.map((color, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => handleColorSelect(color)}
                            style={[
                              styles.colorOption,
                              formData.color === color.name && styles.colorOptionSelected,
                            ]}
                          >
                            <View style={[styles.colorOptionCircle, { backgroundColor: color.hex }]} />
                            <Text style={styles.colorOptionText}>{color.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Action Buttons */}
                  <View style={styles.formButtons}>
                    <TouchableOpacity
                      onPress={() => {
                        setShowAddForm(false);
                        setEditingVehicle(null);
                        setFormData({ model: '', plate: '', color: 'Silver', colorHex: '#c0c0c0' });
                      }}
                      style={styles.cancelButton}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={editingVehicle ? handleUpdateVehicle : handleAddVehicle}
                      style={styles.saveButton}
                      activeOpacity={0.9}
                    >
                      <LinearGradient
                        colors={['#10b981', '#059669']}
                        style={styles.saveButtonGradient}
                      >
                        <CheckCircle size={18} color="#ffffff" />
                        <Text style={styles.saveButtonText}>
                          {editingVehicle ? 'Update' : 'Save Vehicle'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e3a8a',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  backButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  backButtonBlur: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statItem: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statContent: {
    padding: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 6,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  vehicleCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  vehicleCardActive: {
    borderColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  vehicleCardGradient: {
    padding: 20,
  },
  activeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  activeBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  colorIndicator: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleModel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  vehicleType: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  setActiveButton: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  setActiveText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
  vehicleDetails: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  colorDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366f1',
  },
  deleteButton: {
    width: 52,
    height: 52,
    backgroundColor: '#fef2f2',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  deleteButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  formCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  formGradient: {
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
    paddingVertical: 14,
  },
  colorSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    gap: 12,
  },
  selectedColor: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  selectedColorText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  changeColorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
  colorPickerContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  colorPickerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  colorOptionSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eff6ff',
  },
  colorOptionCircle: {
    width: 24,
    height: 24,
    borderRadius: 8,
  },
  colorOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748b',
  },
  saveButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});