import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const ModalStyles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'flex-end',
        width: width - 20
    },
    contentView: {
        backgroundColor: '#fff',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: .25,
        shadowRadius: 30,
        elevation: 5,
        paddingHorizontal: 30,
        paddingBottom: 10,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        paddingTop: 20,
        marginLeft: -20,
        marginBottom: -20
    },
    titleModal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginBottom: 10
    },
    titleText: { 
        color: '#000', 
        fontSize: 20, 
        fontWeight: '600', 
        fontFamily: 'Lato'
    },
    button: {
        borderRadius: 5,
        backgroundColor: '#994ce6',
        width: width - 60,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        // borderWidth: 2,
        // borderColor: '#323330',
        shadowOffset: {
            width: 1,
            headerRight: 2
        },
        shadowRadius: 2,
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderColor: '#edebec',
        backgroundColor: '#edebec',
        width: width - 60,
        marginVertical: 10
    },
    textLabel: {
        fontSize: 15,
        color: '#726f75',
        fontWeight: '600'
    },
    boxUploadContainer: {
        flexDirection: 'row',
         width: (width - 60), 
         height: 70, 
         justifyContent: 'flex-start'
    },
    boxUploadItem: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        display: 'flex'
    },
    itemColumn: {
        width: (width - 60) / 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    itemRow: {
        width: (width - 60),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    textButton: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff'
    }
})

export const placeHolderTextColor = '#a39ea0'