import {SafeAreaView, StyleSheet, Text, TextInput} from 'react-native'
import { useBigTodosStore } from 'store/zustandStore';
import { useEffect } from "react";

export default function ReocoilTest () {
    const text = useBigTodosStore((state: any) => state.test);
    const setText = useBigTodosStore((state: any) => state.setTest);
    const textChk = text ? true : false;

    function changeAtom (val: string){
        setText(val)
    }

    useEffect(()=>{
        console.log('현재 test 값:', text)
        console.log('textChk:', textChk)
    }, [text, textChk])

    return (
        <SafeAreaView>
            <Text>{textChk ? text : '입력된 값이 없습니다.'}</Text>
            <TextInput 
                placeholder='값을 입력하세요' 
                value={text as string} 
                onChangeText={(text) => changeAtom(text)} 
                style={styles.input}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        margin: 10,
        borderRadius: 5,
    }
});