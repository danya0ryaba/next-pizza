'use client'

import React from 'react';
import { CheckoutSidebar, Container, Title } from '@/shared/components/shared';
import { useCart } from '@/shared/hooks';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckoutAddressForm, CheckoutCart } from '@/shared/components/shared/checkout';
import { CheckoutPersonalForm } from '@/shared/components/shared/checkout/checkout-personal-form';
import { checkoutFormSchema, CheckoutFormValues } from '@/shared/constants';
import { createOrder } from '@/app/actions';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { Api } from '@/shared/services/api-client';

const VAT = 15
const DELIVERY_PRICE = 250

export default function CheckoutPage() {


    const [submitting, setSubmitting] = React.useState(false);
    const { updateItemQuantity, totalAmount, items, removeCartItem, loading } = useCart()
    const { data: session } = useSession();

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            email: '',
            firstName: session?.user.name || '',
            lastName: '',
            phone: '',
            address: '',
            comment: '',
        }
    })

    React.useEffect(() => {
        async function fetchUserInfo() {
            const data = await Api.auth.getMe();
            const [firstName, lastName] = data.fullName.split(' ');

            form.setValue('firstName', firstName);
            form.setValue('lastName', lastName);
            form.setValue('email', data.email);
        }

        if (session) {
            fetchUserInfo();
        }
    }, [session]);

    const vatPrice = (totalAmount * VAT) / 100
    const totalPrice = totalAmount + vatPrice + DELIVERY_PRICE

    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1
        updateItemQuantity(id, newQuantity)
    }

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setSubmitting(true);

            const url = await createOrder(data);

            toast.success('Заказ успешно оформлен! 📝 Переход на оплату... ', {
                icon: '✅',
            });

            if (url) {
                location.href = url;
            }
        } catch (err) {
            console.log(err);
            setSubmitting(false);
            toast.error('Не удалось создать заказ', {
                icon: '❌',
            });
        }
    };

    return (

        <Container className="mt-10">

            <Title text="Оформление заказа" className="font-extrabold mb-8 text-[36px]" />

            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='flex gap-10'>

                        {/* Левая часть */}
                        <div className='flex flex-col gap-10 flex-1 mb-20'>

                            <CheckoutCart
                                items={items}
                                onClickCountButton={onClickCountButton}
                                removeCartItem={removeCartItem}
                                loading={loading}
                            />

                            <CheckoutPersonalForm className={loading ? 'opacity-40 pointer-events-none' : ''} />

                            <CheckoutAddressForm className={loading ? 'opacity-40 pointer-events-none' : ''} />

                        </div>

                        {/* Правая часть */}
                        <div className="w-[450px]">
                            <CheckoutSidebar totalAmount={totalPrice} loading={loading || submitting} />
                        </div>

                    </div>
                </form>
            </FormProvider>

        </Container>
    );
}
