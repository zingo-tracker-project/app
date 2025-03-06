import React, {useMemo, useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { Calendar } from "react-native-calendars";
import {GestureHandlerRootView} from "react-native-gesture-handler";

const CalendarSortTabs = () => {
  // 탭 정렬 기준
  const [selectedTab, setSelectedTab] = useState("time");
  // 항 일 덩어리
  const [concept, setConcept] = useState([
    {
      id: 1,
      name: "출근",
      bigTodos: [{ id: 1, name: "달성도 3/3", doingYn: true }],
      createDate: "2025-02-04",
      startTime: "07:00",
      endTime: "09:00",
      type: "default",
      order: 1,
    },
    {
      id: 2,
      name: "퇴근",
      bigTodos: [],
      createDate: "2025-02-04",
      startTime: "18:00",
      endTime: "20:00",
      type: "default",
      order: 2,
    },
      {
          id: 3,
          name: "취침",
          bigTodos: [],
          createDate: "2025-02-09",
          startTime: "23:00",
          endTime: "07:00",
          type: "custom",
          order: 3,
      },
  ]);

    // 정렬기준 순서대로 할 일 목록 리턴
    const sortedConcepts = useMemo(() => {
        if (selectedTab === "time") {
            return [...concept].sort((a, b) => a.startTime.localeCompare(b.startTime));
        }
        else if (selectedTab === "order"){
            return [...concept].sort((a, b) => a.order - b.order);
        }
    }, [concept, selectedTab]);

    // 드래그 종료 시 배열 저장
    const handleDragEnd = ({ data }) => {
        // order 값 업데이트
        const updatedData = data.map((item, index) => ({
            ...item,
            order: index, // 새로운 순서 반영
        }));
        setConcept(updatedData);
    };

  return (
    <GestureHandlerRootView>
        <View style={styles.container}>
            {/* 캘린더 */}
            <Calendar
                current={"2025-02-04"}
                markedDates={{ "2025-02-04": { selected: true, marked: true, selectedColor: "black" } }}
                theme={{
                    selectedDayBackgroundColor: "black",
                    selectedDayTextColor: "white",
                    todayTextColor: "red",
                    arrowColor: "black",
                }}
            />

            {/* 2번 영역 - 정렬 탭 */}
            <View style={styles.tabContainer}>
                {["time", "order"].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tabButton, selectedTab === tab && styles.activeTab]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab === "time" ? "시간순" : "사용자 지정순"}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 3번 영역 - ToDo 리스트 */}
            <DraggableFlatList
                data={sortedConcepts}
                keyExtractor={(item) => item.id.toString()}
                onDragEnd={handleDragEnd}
                renderItem={({ item, drag }) => (
                    <TouchableOpacity
                        style={styles.conceptItem}
                        onLongPress={selectedTab === "order" ? drag : undefined}
                    >
                        <Text style={styles.conceptTitle}>{item.name} ({item.startTime}-{item.endTime})</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16,},
  
  // 정렬 탭
  tabContainer: {flexDirection: "row", marginTop: 16, borderBottomWidth: 1, borderColor: "#E0E0E0",},
  tabButton: {flex: 1, paddingVertical: 10, alignItems: "center",},
  activeTab: {borderBottomWidth: 2, borderColor: "black",},
  tabText: {fontSize: 16, color: "gray",},
  activeTabText: {color: "black", fontWeight: "bold",},
    
  // 할 일 목록
  conceptItem: {padding: 16, marginTop: 8, backgroundColor: "#F5F5F5", borderRadius: 8,},
  conceptTitle: {fontSize: 16, fontWeight: "bold",},
});

export default CalendarSortTabs;
