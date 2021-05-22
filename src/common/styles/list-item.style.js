import { StyleSheet } from "react-native";

export const ItemStyles = StyleSheet.create({
    sectionItem: {
        display: 'flex',
        flexDirection: 'row',
        height: 65,
        paddingVertical: 10,
        marginVertical: 8,
        backgroundColor: '#2e2d2d',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 8
    },
    index: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.35,
        backgroundColor: '#9dafed',
        height: 45,
        borderRadius: 10
    },
    content: {
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 5
    },
    progress: {
        flex: 0.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 100
    },
    sectionHeader: {
        display: 'flex',
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    sectionHeaderLeft: {
    },
    sectionHeaderRight: {
    },
    textIndex: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    },
    textDes: {
        color: '#c4c0c0',
        fontSize: 12
    },
})