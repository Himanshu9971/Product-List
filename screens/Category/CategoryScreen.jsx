import { View, Text, StyleSheet, ScrollView, Image, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import Colors from '../../utils/Colors';
import { fetchProductsByCategory } from '../../utils/api';
import { useQuery } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CategoryScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { category } = route.params;
    const [refreshing, setRefreshing] = useState(false);

    const { data: products = [], error, isLoading, refetch } = useQuery({
        queryKey: ['products', category],
        queryFn: () => fetchProductsByCategory(category),
        enabled: !!category,
    });

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollViewContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color={Colors.primaryButtonText} />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{category}</Text>
                </View>
                <View style={styles.productError}>
                    {isLoading && <Text style={styles.productErrorText}>Loading products...</Text>}
                    {error && <Text style={styles.productErrorText}>Error fetching products: {error.message}</Text>}
                </View>
                {!isLoading && !error && products.length === 0 && (
                    <View style={styles.productErrorBottom}>
                        <Text style={styles.productErrorText}>No products found.</Text>
                    </View>
                )}
                {products.length > 0 && products.map((item) => (
                    <View key={item.id} style={styles.productItem}>
                        <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
                        <Text style={styles.productTitle}>{item.title}</Text>
                        <Text style={styles.productDescription}>{item.description}</Text>
                        <Text>Price: ${item.price}</Text>
                        <Text>Rating: {item.rating}</Text>
                        <Text>Stock: {item.stock}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primaryColor,
    },
    scrollViewContainer: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    productError: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    productErrorBottom: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productErrorText: {
        color: Colors.errorColor,
        fontSize: 18,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.primaryText,
    },
    productItem: {
        padding: 20,
        marginBottom: 20,
        backgroundColor: Colors.infoBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    productTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.primaryText,
        marginBottom: 5,
    },
    productDescription: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors.primaryText,
        marginBottom: 5,
    },
    backButton: {
        width: 100,
        flexDirection: 'row',
        backgroundColor: Colors.primaryButton,
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
    },
    backButtonText: {
        fontSize: 18,
        color: Colors.primaryButtonText,
        marginLeft: 10,
    }
});
