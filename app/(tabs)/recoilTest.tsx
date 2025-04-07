import {SafeAreaView, StyleSheet, Text, TextInput} from 'react-native'
import {useRecoilState, useRecoilValue} from "recoil";
import {testAtom, testSelector} from "@/recoil/bigTodosAtom";
import {useEffect} from "react";

export default function ReocoilTest () {

    const [text, setText] = useRecoilState(testAtom)

    const textChk = useRecoilValue(testSelector)

    function changeAtom (val:string){
        setText((prev) => val)
    }

    useEffect(()=>{
        console.log(textChk)
    }, [])

    return (
        <SafeAreaView>
            <Text>{textChk ? text : '입력된 값이 없습니다.'}</Text>
            <TextInput placeholder='값을 입력하세요' value={text} onChangeText={(text) => changeAtom(text)} style={styles.input}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 5, borderRadius: 5 }
})