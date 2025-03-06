import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Button, StyleSheet } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import * as Calendar from 'expo-calendar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [concepts, setConcepts] = useState([]);
    const [sortBy, setSortBy] = useState('time'); // 'time' or 'order'
    const [modalVisible, setModalVisible] = useState(false);
    const [newConcept, setNewConcept] = useState({ name: '', startTime: '', endTime: '', bigTodos: [] });

    const getCalendarPermission = async () => {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            console.log('Available Calendars:', calendars);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setShowCalendar(false);
    };

    const handleSort = (type) => {
        setSortBy(type);
        if (type === 'time') {
            setConcepts([...concepts].sort((a, b) => a.startTime.localeCompare(b.startTime)));
        } else {
            setConcepts([...concepts].sort((a, b) => a.order - b.order));
        }
    };

    const handleAddConcept = () => {
        if (!newConcept.name || !newConcept.startTime || !newConcept.endTime) return;
        setConcepts([...concepts, { ...newConcept, id: Date.now(), type: 'custom', order: concepts.length }]);
        setNewConcept({ name: '', startTime: '', endTime: '', bigTodos: [] });
        setModalVisible(false);
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { setShowCalendar(true); getCalendarPermission(); }}>
                    <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
                </TouchableOpacity>
            </View>
            {showCalendar && <Text>달력 API 추가</Text>}

            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => handleSort('time')} style={[styles.tab, sortBy === 'time' && styles.activeTab]}>
                    <Text style={styles.tabText}>시간순</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSort('order')} style={[styles.tab, sortBy === 'order' && styles.activeTab]}>
                    <Text style={styles.tabText}>사용자 지정순</Text>
                </TouchableOpacity>
            </View>

            <DraggableFlatList
                data={concepts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, drag }) => (
                    <TouchableOpacity onLongPress={drag} style={styles.todoItem}>
                        <Text style={styles.todoText}>{item.name} ({item.startTime} - {item.endTime})</Text>
                    </TouchableOpacity>
                )}
                onDragEnd={({ data }) => setConcepts(data)}
            />

            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                <Text style={styles.addButtonText}>새로운 할일 추가하기</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <TextInput placeholder='이름' value={newConcept.name} onChangeText={(text) => setNewConcept({ ...newConcept, name: text })} style={styles.input} />
                    <TextInput placeholder='시작 시간' value={newConcept.startTime} onChangeText={(text) => setNewConcept({ ...newConcept, startTime: text })} style={styles.input} />
                    <TextInput placeholder='종료 시간' value={newConcept.endTime} onChangeText={(text) => setNewConcept({ ...newConcept, endTime: text })} style={styles.input} />
                    <Button title='추가' onPress={handleAddConcept} />
                    <Button title='닫기' onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    header: { padding: 10, alignItems: 'center', borderBottomWidth: 1, borderColor: '#ddd' },
    dateText: { fontSize: 18, fontWeight: 'bold' },
    tabContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
    tab: { padding: 10, marginHorizontal: 5, borderBottomWidth: 2, borderColor: 'transparent' },
    activeTab: { borderColor: 'black' },
    tabText: { fontSize: 16 },
    todoItem: { padding: 15, backgroundColor: '#eee', marginVertical: 5, borderRadius: 5 },
    todoText: { fontSize: 16 },
    addButton: { padding: 15, backgroundColor: '#007BFF', alignItems: 'center', borderRadius: 5, marginTop: 10 },
    addButtonText: { color: '#fff', fontSize: 16 },
    modalContainer: { padding: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 5, borderRadius: 5 }
});

export default App;
