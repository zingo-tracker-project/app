import React, {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal, StyleSheet, ScrollView } from "react-native";
import makeApiRequest from '@/hooks/api'
import { useUserStore } from 'store/zustandStore';

const Todo = () => {
    // 로그인 시 유저 이름
    const user = useUserStore((state) => state.user);
    const username = user?.userNm;
    
    // 오늘 할일 컨셉
    const [concept, setTabs] = useState([
        { id: 1, name: "평일컨셉", bigTodos: ["알람 울리자마자 기상", "지각 안하기", "간식 참기", "12시 전에 폰끄고 취침"] },
        { id: 2, name: "주말컨셉", bigTodos: ["마셔마셔~", "먹고뒤져~"] },
        { id: 3, name: "취뽀루틴", bigTodos: ["7시기상", "순수 공부시간 8시간", "음주가무 금지"] },
        { id: 4, name: "사람답게만 살자", bigTodos: ["술 참아보기", "간식 참아보기", "또 지각할거야..?"] },
        { id: 5, name: "제2의 슈카월드", bigTodos: ["매일 5천원 저금", "가까우면 걸어가", "택시타면 죽는다", "한끼에 만원 이하", "ISA.. 이젠 만들어야지??"] },
        { id: 6, name: "징고 앱개발", bigTodos: ["야근해도 30분만 봐보자", "주말엔 많이 하자잉?", "레이아웃 잡기", "로그인 기능 구현"] },
        { id: 7, name: "Custom", bigTodos: ["Big Todos1", "Big Todos2"] },
    ]);
    // 컨셉 탭 액티브 체크
    const [activeTabId, setActiveTabId] = useState(1);
    // 컨셉 추가 모달 활성화 체크
    const [modalVisible, setModalVisible] = useState(false);
    // 컨셉 추가 모달창 - 컨셉 이름
    const [newConceptName, setNewTabName] = useState("");
    // 컨셉 추가 모달창 - 컨셉 내 BigTodos 내용
    const [newBigTodos, setNewBigTodos] = useState([""]);

    // 컨셉 추가 모달창 - 저장 or 취소
    const handleConfirm = () => {
        // 컨셉이름 입력돼있고, BigTodos 내용이 입력돼있으면 저장
        if (newConceptName && newBigTodos.length > 0 && newBigTodos.filter(todos=>todos).length > 0) {
            const newTab = { id: concept.length + 1, name: newConceptName, bigTodos: newBigTodos.filter(task => task) };
            setTabs([...concept, newTab]);
        }
        setModalVisible(false);
        setNewTabName("");
        setNewBigTodos([""]);
    };

    // 컨셉 추가 모달창 - BigTodos 입력칸 추가 버튼
    const addNewBigTodsInput = () => {
        setNewBigTodos([...newBigTodos, ""]);
    };

    // 컨셉 추가 모달창 - BigTodos 입력 이벤트
    const updateNewBigTodos = (text: string, index: number) => {
        const newTodosList = [...newBigTodos];
        newTodosList[index] = text;
        setNewBigTodos(newTodosList);
    };

    // 컨셉 추가 모달창 = BigTodos 입력 초기화 버튼
    const resetNewBigTodos = (index: number) => {
        const newTodosList = [...newBigTodos];
        newTodosList[index] = ""
        setNewBigTodos(newTodosList);
    }

    useEffect(()=>{
        console.log('현재 사용자 정보:', user);
        console.log('사용자 이름:', username);
        console.log('API URL:', process.env.EXPO_PUBLIC_API_URL);
    }, [user, username])

    return (
        <View style={styles.container}>
            {/* 최상단 인사문구 */}
            <Text style={styles.username}>안녕하세요!{username &&  <Text style={styles.bold}>{username}님</Text>}</Text>
            <Text style={styles.subtitle}>오늘은 어떤 하루로 만들까요?</Text>

            {/* 투두컨셉 목록 */}
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    bounces={true}
                    style={styles.tabScrollView}
                >
                    <View style={styles.tabContainer}>
                        {concept.map((tab) => (
                            <TouchableOpacity key={tab.id} onPress={() => setActiveTabId(tab.id)} style={[styles.tab, activeTabId === tab.id && styles.activeTab]}>
                                <Text style={styles.tabText}>{tab.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* 투두컨셉 하위 BigTodo 목록 */}
            <FlatList
                data={concept.find(tab => tab.id === activeTabId)?.bigTodos || []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.tag}><Text style={styles.tagText}>{item} +</Text></View>
                )}
            />

            {/* 투두컨셉 버튼 */}
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            {/* 투두컨셉 추가 모달 */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>컨셉 추가하기</Text>
                        <Text>탭 이름</Text>
                        <TextInput style={styles.input} value={newConceptName} onChangeText={setNewTabName} placeholder="탭 이름 입력" />
                        <Text>할 일</Text>
                        {newBigTodos.map((task, index) => (
                            <TextInput key={index} style={styles.input} value={task} onChangeText={(text) => updateNewBigTodos(text, index)} placeholder="할 일 입력" />
                        ))}
                        <TouchableOpacity onPress={addNewBigTodsInput} style={styles.addTaskButton}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
                                <Text style={styles.buttonText}>확인</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.buttonText}>취소</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },

    // 최상단 인사문구
    username: { fontSize: 18, marginBottom: 10 },
    bold: { fontWeight: "bold" },
    subtitle: { fontSize: 16, marginBottom: 20 },

    // 할 일 컨셉 - 탭
    tabScrollView: { marginBottom: 20 },
    tabContainer: { flexDirection: "row",flex: 1, justifyContent: 'flex-start' },
    tab: { padding: 10, backgroundColor: "#ddd", marginRight: 5, borderRadius: 5 },
    activeTab: { backgroundColor: "#888" },
    tabText: { color: "#000" },

    // 할 일 컨셉 - BigTodos 내용
    tag: { padding: 10, backgroundColor: "#eee", marginVertical: 5, borderRadius: 5 },
    tagText: { color: "#000" },

    // 할 일 컨셉 추가 모달
    addButton: { marginTop: 20, backgroundColor: "#000", width: 40, height: 40, justifyContent: "center", alignItems: "center", borderRadius: 20 },
    addButtonText: { color: "#fff", fontSize: 24 },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContent: { width: 300, backgroundColor: "#fff", padding: 20, borderRadius: 10, alignItems: "center" },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 10, borderRadius: 5 },
    addTaskButton: { marginBottom: 10, padding: 5, backgroundColor: "#ddd", borderRadius: 5 },
    buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
    confirmButton: { backgroundColor: "#000", padding: 10, borderRadius: 5, flex: 1, marginRight: 5, alignItems: "center" },
    cancelButton: { backgroundColor: "#888", padding: 10, borderRadius: 5, flex: 1, marginLeft: 5, alignItems: "center" },
    buttonText: { color: "#fff" },
});

export default Todo;
