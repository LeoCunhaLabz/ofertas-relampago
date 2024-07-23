import React from 'react';

const CategoryList = ({ categories, removeCategory }) => {
    return (
        <ul className="list-none w-full">
            {categories.map((category, index) => (
                <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                    {category.name} <button className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700" onClick={() => removeCategory(category)}>Remover</button>
                </li>
            ))}
        </ul>
    );
};

export default CategoryList;
