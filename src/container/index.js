import * as React from 'react';
import { View, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../components/dashboard';
import Book from '../components/book';
import Sport from '../components/sport';
import Plan from '../components/plan';
import Creative from '../components/creative';
import Diary from '../components/diary';
import Relax from '../components/relax';
import Statistic from '../components/statistic';
import { FontAwesome } from '@expo/vector-icons';
import Maxim from '../components/maxim';
import Travel from '../components/travel';
import Style from '../components/style';
import Detail from '../components/activity/detail';
import DetailBook from '../components/book/detail';
import DetailTravel from '../components/travel/detail';
import Month from '../components/diary/detail';
import Day from '../components/diary/detail-day';
import Settings from '../components/settings';
import ViewImage from '../components/travel/detail/view';
import Focus from '../components/relax/focus';
import Sleep from '../components/relax/sleep';
import RelaxAction from '../components/relax/action';
import { UserContext } from '../components/context/user.context';
import Authentication from '../components/authentication';
import Investment from '../components/investment';
import ViewInvest from '../components/investment/view';
import { useNotifications } from '../services/expo-notify';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import Life from '../components/life';
import Story from '../components/life/info';
import Vocabulary from '../components/vocabulary';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack({ context }) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Dashboard" children={(props) => <Dashboard {...props} context={context} />} options={({ route, navigation }) => ({
                headerShown: true, headerTitle: '', headerTitleAlign: 'center', headerRight: props => (
                    <TouchableOpacity style={styles.cog} onPress={() => navigation.navigate('Setting')}>
                        <FontAwesome name="cog" size={20} color={context.theme.colors.text} />
                    </TouchableOpacity>
                ), headerTitleStyle: {
                    fontFamily: 'LatoBold'
                }
            })} />
            <Stack.Screen name="Book" children={(props) => <Book {...props} context={context} />} options={{ headerShown: true, headerTitleAlign: 'center', headerTitle: '', headerTitleStyle: { fontFamily: 'LatoBold', fontWeight: 'bold' } }} />
            <Stack.Screen name="Sport" component={Sport} options={{ headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Plan" component={Plan} options={({ route, navigation }) => ({
                headerShown: true, headerTitleAlign: 'center', headerLeft: () => (
                    <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => navigation.goBack()}>
                        <FontAwesome name='chevron-left' size={20} color='white' />
                    </TouchableOpacity>
                ),
                headerTitleStyle: { fontFamily: 'LatoBold', fontWeight: 'bold' }
            })} />
            <Stack.Screen name="Creative" component={Creative} options={{ headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Diary" component={Diary} options={{ headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Relax" component={Relax} options={{ headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Maxim" component={Maxim} options={{ headerShown: true, headerTitleAlign: 'center', headerTitle: '', headerTransparent: true }} />
            <Stack.Screen name="Travel" component={Travel} options={{ headerShown: true, headerTitleAlign: 'center', headerTitle: '', headerLeftContainerStyle: { paddingLeft: 15 }, headerRightContainerStyle: { paddingRight: 15 } }} />
            <Stack.Screen name="Style" component={Style} options={{ headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Detail" component={Detail} options={{ headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Detail Book" children={props => <DetailBook {...props} context={context} />} options={({ route, navigation }) => ({ data: route.params.data, headerShown: true, headerTitleAlign: 'center', headerTransparent: true })} />
            <Stack.Screen name="Detail Travel" component={DetailTravel} options={({ route, navigation }) => ({
                headerLeft: () => (
                    <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => navigation.goBack()}>
                        <FontAwesome name='chevron-left' size={20} color='white' />
                    </TouchableOpacity>
                )
                , headerShown: true, headerTitleAlign: 'center', title: route.params.title,
                headerTitleStyle: { fontFamily: 'LatoBold', fontWeight: 'bold' }
            })} />
            <Stack.Screen name="View Image" component={ViewImage} options={{ headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Month" component={Month} options={({ route, navigation }) => ({ headerShown: true, headerTitleAlign: 'center', headerTransparent: true, headerTitleStyle: { color: 'white' }, title: route.params.month + `/${route.params.year}` })} />
            <Stack.Screen name="Day" component={Day} options={{ headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Focus" component={Focus} options={{ headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Sleep" component={Sleep} options={{ headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Relax Action" component={RelaxAction} options={{ headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Life" component={Life} options={{ headerShown: true, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Life Story" component={Story} options={{ headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Vocabulary" component={Vocabulary} options={{ headerShown: true, headerTitleAlign: 'center', headerTitle: '' }} />
            <Stack.Screen name="Investment" component={Investment} options={({ route, navigation }) => ({
                headerShown: true, headerTitle: '', headerTitleAlign: 'center', headerLeft: () => (
                    <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => navigation.goBack()}>
                        <FontAwesome name='chevron-left' size={20} color='white' />
                    </TouchableOpacity>
                )
            })} />
            <Stack.Screen name="View Invest" component={ViewInvest} options={({ route, navigation }) => ({
                headerShown: true, headerTitleAlign: 'center', headerTitle: '', headerLeft: () => (
                    <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => navigation.goBack()}>
                        <FontAwesome name='chevron-left' size={20} color='white' />
                    </TouchableOpacity>
                )
            })} />
            <Stack.Screen name="Setting" children={(props) => <Settings {...props} context={context} />} options={({ route, navigation }) => ({
                headerShown: true, headerTitleAlign: 'center', headerLeft: () => (
                    <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => navigation.goBack()}>
                        <FontAwesome name='chevron-left' size={20} color='white' />
                    </TouchableOpacity>
                ),
                headerTitleStyle: { fontFamily: 'LatoBold', fontWeight: 'bold' }
            })} />
        </Stack.Navigator>
    )
}

function StatisticStack({ context }) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Statistic" component={Statistic} options={{ headerTitleAlign: 'center' }} />
        </Stack.Navigator>
    )
}

export default function Container() {
    useNotifications();
    const [loaded] = useFonts({
        'SansPro': require('../../assets/fonts/SourceSansPro-Regular.ttf'),
        'Lato': require('../../assets/fonts/Lato-Regular.ttf'),
        'LatoBold': require('../../assets/fonts/Lato-Bold.ttf')
    })
    if (!loaded) {
        return <AppLoading />
    } else {
        return (
            <UserContext.Consumer>
                {
                    context => (
                        <View style={styles.container}>
                            <StatusBar translucent backgroundColor="#050504" barStyle={"light-content"} />
                            <NavigationContainer theme={context.theme}>
                                {
                                    context.user ? <Tab.Navigator
                                        screenOptions={({ route, navigation }) => ({
                                            tabBarHideOnKeyboard: true,
                                            tabBarLabelStyle: {
                                                color: '#c4c0c0'
                                            },
                                            tabBarItemStyle: {
                                                height: 45
                                            },
                                            tabBarStyle: {
                                                backgroundColor: '#050504'
                                            },
                                            tabBarIcon: ({ focused, color, size }) => {
                                                let iconName;
                                                if (route.name === 'Home') {
                                                    iconName = focused ? 'home' : 'home'
                                                } else if ((route.name === 'Analysis')) {
                                                    iconName = focused
                                                        ? 'line-chart'
                                                        : 'line-chart';
                                                } else if ((route.name === 'Settings')) {
                                                    iconName = focused
                                                        ? 'cog'
                                                        : 'cog';
                                                    //navigation.setParams({handleDarkMode: handleDarkMode()})
                                                }
                                                return <FontAwesome name={iconName} size={size} color={focused ? '#e33310' : color} />;
                                            }
                                        })}
                                    >
                                        <Tab.Screen options={{ headerShown: false }} name="Home" children={(props) => <HomeStack {...props} context={context} />} />
                                        <Tab.Screen options={{ headerShown: false }} name="Analysis" children={(props) => <StatisticStack {...props} context={context} />} />
                                    </Tab.Navigator> : <Stack.Navigator>
                                        <Stack.Screen name="Login" children={(props) => <Authentication {...props} context={context} />} options={{ headerShown: false, headerTitleAlign: 'center' }} />
                                    </Stack.Navigator>
                                }

                            </NavigationContainer>
                        </View>
                    )
                }
            </UserContext.Consumer>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cog: {
        marginRight: 10,
        width: 25
    }
})