import React from 'react';

interface CategoryListProps {
    categories: Array<{ name: string }>;
    removeCategory: (category: { name: string }) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, removeCategory }) => {
    return (
        <ul className="list-none w-full">
            {categories.map((category: { name: string }, index: number) => (
                <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                    {category.name} <button className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700" onClick={() => removeCategory(category)}>Remover</button>
                </li>
            ))}
        </ul>
    );
};

export default CategoryList;
