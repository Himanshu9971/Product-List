import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Buttons from '../../components/Buttons';
import Colors from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoggedIn, setUserData, setIsChecked } from '../../ReduxStore/ReduxSlice';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../../utils/api';

export default function HomeScreen({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();
    const { isLoggedIn, userData, isChecked } = useSelector(state => state.auth);

    const { data: categories, error, isLoading, refetch } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        refetchOnWindowFocus: false,
    });

    const checkLoginStatus = async () => {
        try {
            const storedData = await AsyncStorage.getItem('signUpForm');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                dispatch(setUserData(parsedData));
                dispatch(setIsLoggedIn(true));
            } else {
                dispatch(setIsLoggedIn(false));
            }
        } catch (error) {
            console.error('Error checking login status:', error);
        } finally {
            dispatch(setIsChecked(true));
        }
    };

    useEffect(() => {
        if (!isChecked) {
            checkLoginStatus();
        }
    }, [isChecked, dispatch]);

    const handleSignUp = () => {
        navigation.navigate('SignUp');
    };

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('auth');
            await AsyncStorage.removeItem('signUpForm');
            dispatch(setUserData({}));
            dispatch(setIsLoggedIn(false));
            dispatch(setIsChecked(false));
            navigation.navigate('SignUp');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleCategoryPress = (category) => {
        navigation.navigate('Category', { category });
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    return (
        <ScrollView
            contentContainerStyle={isLoggedIn ? styles.loggedContainer : styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            {isLoggedIn ? (
                <View style={styles.loggedInContainer}>
                    <Text style={styles.welcomeText}>Welcome Back, {userData.userName}!</Text>
                    <View style={styles.userInfoContainer}>
                        <Text style={styles.userInfoText}>Email: {userData.email}</Text>
                        <Text style={styles.userInfoText}>Mobile: {userData.mobileNumber}</Text>
                    </View>
                    <View style={styles.categoriesBlock}>
                        {isLoading && <Text>Loading categories...</Text>}
                        {error && <Text>Error fetching categories: {error.message}</Text>}
                        {categories && (
                            <View style={styles.scrollView}>
                                <View style={styles.categoriesGrid}>
                                    {categories.map((category, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.categoryItem}
                                            onPress={() => handleCategoryPress(category.name)}
                                        >
                                            <Text style={styles.categoryText}>{category.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                    <Buttons
                        onPress={handleLogout}
                        title="Logout"
                        style={styles.logoutButton}
                    />
                </View>
            ) : (
                <>
                    <Text style={styles.homePageText}>Welcome to Home Page</Text>
                    <View style={styles.homeButton}>
                        <Buttons
                            onPress={handleSignUp}
                            title="Sign Up"
                            style={styles.signUpButton}
                        />
                        <Buttons
                            onPress={handleLogin}
                            title="Login"
                            style={styles.loginButton}
                        />
                    </View>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loggedContainer: {
        flexGrow: 1,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        padding: 20,
    },
    loggedInContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.secondaryBackground,
        borderRadius: 10,
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    homePageText: {
        fontSize: 40,
        fontWeight: '700',
        textAlign: 'center',
        color: Colors.primaryText,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 30,
        fontWeight: '700',
        textAlign: 'center',
        color: Colors.primaryText,
        marginBottom: 10,
    },
    userInfoContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: Colors.infoBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.borderColor,
    },
    userInfoText: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.primaryText,
        marginBottom: 10,
    },
    homeButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
    },
    signUpButton: {
        width: '45%',
        backgroundColor: Colors.buttonSecondary,
    },
    loginButton: {
        width: '45%',
        backgroundColor: Colors.buttonPrimary,
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: Colors.buttonPrimary,
    },
    logoutButtonText: {
        color: Colors.primaryText,
        fontSize: 18,
        fontWeight: '700',
    },
    categoriesBlock: {
        flex: 1,
        width: '100%',
        marginTop: 20,
    },
    scrollView: {
        width: '100%',
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryItem: {
        width: '48%',
        marginBottom: 20,
        height: 80,
        paddingHorizontal: 20,
        backgroundColor: Colors.infoBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.primaryText,
    },
});
