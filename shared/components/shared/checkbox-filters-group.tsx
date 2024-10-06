'use client';

import React from 'react'
import { FilterCheckbox, FilterCheckboxProps } from './filter-checkbox';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';

type Item = FilterCheckboxProps

interface Props {
    title: string;
    items: Item[];
    defaultItems?: Item[];
    limit?: number;
    loading?: boolean;
    searchInputPlaceholder?: string;
    onClickCheckbox?: (id: string) => void;
    defaultValue?: string[];
    selected?: Set<string>;
    className?: string;
    name?: string;
}

export const CheckboxFiltersGroup: React.FC<Props> = ({
    title,
    items,
    defaultItems,
    limit = 5,
    searchInputPlaceholder = 'Поиск...',
    className,
    loading,
    onClickCheckbox,
    selected,
    name,
    defaultValue
}) => {


    const [showAll, setShowAll] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState('')


    const onChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value)
    }

    if (loading) {
        return <div className={className}>
            <p className="font-bold mb-3">{title}</p>
            {
                [... new Array(limit)].map((_, index) => {
                    return <Skeleton key={index} className='h-6 mb-4 rounded-[12px]' />
                })
            }
            <Skeleton className='w-28 h-6 mb-4 rounded-[12px]' />
        </div>
    }

    const list = showAll ?
        items.filter(item => item.text.toLowerCase().includes(searchValue.toLowerCase()))
        : (defaultItems || items).slice(0, limit)

    return <div className={className}>
        <p className="font-bold mb-3">{title}</p>

        {showAll && (<div className='mb-5'>
            <div className="mb-5">
                <Input onChange={onChangeSearchValue} placeholder={searchInputPlaceholder} className="bg-gray-50 border-none" />
            </div>
        </div>
        )}


        <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
            {list.map((item, index) => (
                <FilterCheckbox
                    key={index}
                    text={item.text}
                    value={item.value}
                    endAdornment={item.endAdornment}
                    checked={selected?.has(item.value)}
                    onCheckedChange={() => onClickCheckbox?.(item.value)}
                    name={name}
                />
            ))}
        </div>

        {items.length > limit && (
            <div className={showAll ? 'border-t border-t-neutral-100 mt-4' : ''}>
                <button className='text-primary mt-3' onClick={() => setShowAll(!showAll)} >
                    {showAll ? "Скрыть" : "+ Показать все"}
                </button>
            </div>
        )}

    </div>
}


