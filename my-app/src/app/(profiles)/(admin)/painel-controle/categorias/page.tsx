"use client"

import { Title } from "@/components/Title";
import { UserContext } from '@/context/UserContext'
import React, { useEffect, useState, useContext } from "react";
import { makeRequest } from "@/../../axios";
import CategoryList from "@/components/CategoryList";

export default function Categorias() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const user = useContext(UserContext);

  useEffect(() => {
    fetchCategories();
  },[])

  const fetchCategories = async () => {
    const response = await makeRequest.get('category/see');
    setCategories(response.data);
  }

  const addCategory = async () => {
    if(newCategory) {
        await makeRequest.post('category/add', {category: newCategory});
        setNewCategory('');
        fetchCategories();
    }
  }

  const removeCategory = async (category: { name: any; }) => {
    await makeRequest.delete(`category/remove?category=${category.name}`);
    fetchCategories();
  }

  return (
    <main className="w-full mt-0 p-4 flex flex-col items-center">
      <Title className="text-center mb-4">Categorias: {categories.length} </Title>
        <div className="flex flex-col items-center gap-4">
            <input
                className="form-input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Adicionar Categoria"
            />
            <button 
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
            onClick={addCategory}>
                Adicionar Categoria
                </button>
            <CategoryList categories={categories} removeCategory={removeCategory} />
        </div>
    </main>
    )
}