import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import type { Recipe } from '../__mocks__/data.mock';
import { Plus, Search, Filter, FileText, Clock, Edit, Trash2, X } from 'lucide-react';

const ContentManagementPage: React.FC = () => {
  const { recipes, initializeData, addRecipe, updateRecipe, deleteRecipe } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || recipe.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(recipes.map(recipe => recipe.category)));

  const handleAddRecipe = () => {
    setEditingRecipe(null);
    setShowModal(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowModal(true);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    if (window.confirm('정말로 이 레시피를 삭제하시겠습니까?')) {
      deleteRecipe(recipeId);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };

    const labels = {
      easy: '쉬움',
      medium: '보통',
      hard: '어려움'
    };

    return (
      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${colors[difficulty as keyof typeof colors]}`}>
        {labels[difficulty as keyof typeof labels]}
      </span>
    );
  };

  const RecipeModal: React.FC = () => {
    const [formData, setFormData] = useState({
      title: editingRecipe?.title || '',
      description: editingRecipe?.description || '',
      imageUrl: editingRecipe?.imageUrl || '',
      ingredients: editingRecipe?.ingredients.join(', ') || '',
      instructions: editingRecipe?.instructions.join('\n') || '',
      cookingTime: editingRecipe?.cookingTime || 0,
      difficulty: editingRecipe?.difficulty || 'easy',
      category: editingRecipe?.category || '',
      tags: editingRecipe?.tags.join(', ') || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const recipeData = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        ingredients: formData.ingredients.split(',').map(item => item.trim()).filter(item => item),
        instructions: formData.instructions.split('\n').map(item => item.trim()).filter(item => item),
        cookingTime: Number(formData.cookingTime),
        difficulty: formData.difficulty as 'easy' | 'medium' | 'hard',
        category: formData.category,
        tags: formData.tags.split(',').map(item => item.trim()).filter(item => item)
      };

      if (editingRecipe) {
        updateRecipe(editingRecipe.id, recipeData);
      } else {
        addRecipe(recipeData);
      }

      setShowModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#FAF7F2] dark:bg-[#333333] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg border border-[#D1D1D1] dark:border-[#404040]">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0]">
                {editingRecipe ? '레시피 수정' : '새 레시피 추가'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-[#878787] hover:text-[#4B4B4B] dark:text-[#A0A0A0] dark:hover:text-[#E0E0E0] hover:bg-[#E0EBF7] dark:hover:bg-[#404040] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  제목
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    카테고리
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    조리 시간 (분)
                  </label>
                  <input
                    type="number"
                    value={formData.cookingTime}
                    onChange={(e) => setFormData({ ...formData, cookingTime: Number(e.target.value) })}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  난이도
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="easy">쉬움</option>
                  <option value="medium">보통</option>
                  <option value="hard">어려움</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  이미지 URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  재료 (쉼표로 구분)
                </label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  required
                  rows={3}
                  placeholder="밥, 김치, 돼지고기, 달걀"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  조리 방법 (줄바꿈으로 구분)
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  required
                  rows={5}
                  placeholder="팬에 기름을 두르고 돼지고기를 볶는다"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  태그 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="간단요리, 볶음밥, 김치"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {editingRecipe ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#242424] p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0] mb-2">콘텐츠 관리</h1>
          <p className="text-[#878787] dark:text-[#A0A0A0]">레시피를 추가하고 관리하세요</p>
        </div>
        <button
          onClick={handleAddRecipe}
          className="flex items-center gap-2 px-6 py-3 bg-[#6789A5] text-white rounded-lg hover:bg-[#5A7E9D] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          새 레시피 추가
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-[#FAF7F2] dark:bg-[#333333] rounded-lg shadow-sm border border-[#D1D1D1] dark:border-[#404040] p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-2">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                레시피 검색
              </div>
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="제목 또는 설명으로 검색..."
              className="w-full px-4 py-3 border border-[#D1D1D1] dark:border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] dark:bg-[#242424] dark:text-[#E0E0E0] text-[#4B4B4B] placeholder-[#878787] dark:placeholder-[#A0A0A0]"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                카테고리 필터
              </div>
            </label>
            <select
              id="category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-[#D1D1D1] dark:border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] dark:bg-[#242424] dark:text-[#E0E0E0] text-[#4B4B4B]"
            >
              <option value="all">전체</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 레시피 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="bg-[#FAF7F2] dark:bg-[#333333] rounded-lg shadow-sm border border-[#D1D1D1] dark:border-[#404040] overflow-hidden hover:shadow-md transition-shadow">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-[#4B4B4B] dark:text-[#E0E0E0] truncate">
                  {recipe.title}
                </h3>
                {getDifficultyBadge(recipe.difficulty)}
              </div>

              <p className="text-[#878787] dark:text-[#A0A0A0] text-sm mb-4 line-clamp-2">
                {recipe.description}
              </p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-[#6789A5] font-medium bg-[#E0EBF7] dark:bg-[#404040] px-2 py-1 rounded">
                  {recipe.category}
                </span>
                <div className="flex items-center gap-1 text-sm text-[#878787] dark:text-[#A0A0A0]">
                  <Clock className="w-4 h-4" />
                  {recipe.cookingTime}분
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[#F0EEEB] dark:bg-[#242424] text-[#878787] dark:text-[#A0A0A0] text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {recipe.tags.length > 3 && (
                  <span className="text-xs text-[#878787] dark:text-[#A0A0A0]">
                    +{recipe.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-[#878787] dark:text-[#A0A0A0]">
                  {new Date(recipe.createdAt).toLocaleDateString('ko-KR')}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditRecipe(recipe)}
                    className="flex items-center gap-1 px-3 py-2 bg-[#E0EBF7] text-[#6789A5] hover:bg-[#D1E0F2] dark:bg-[#404040] dark:text-[#8cb5e2] dark:hover:bg-[#505050] rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-[#878787] dark:text-[#A0A0A0] mx-auto mb-4" />
          <p className="text-[#878787] dark:text-[#A0A0A0] text-lg">
            {searchTerm || filterCategory !== 'all'
              ? '검색 결과가 없습니다.'
              : '등록된 레시피가 없습니다.'}
          </p>
        </div>
      )}

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#FAF7F2] dark:bg-[#333333] rounded-lg shadow-sm border border-[#D1D1D1] dark:border-[#404040] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#E0EBF7] dark:bg-[#404040] rounded-lg">
              <FileText className="w-5 h-5 text-[#6789A5]" />
            </div>
            <h3 className="text-lg font-semibold text-[#4B4B4B] dark:text-[#E0E0E0]">총 레시피</h3>
          </div>
          <p className="text-3xl font-bold text-[#6789A5]">
            {recipes.length}개
          </p>
        </div>
        <div className="bg-[#FAF7F2] dark:bg-[#333333] rounded-lg shadow-sm border border-[#D1D1D1] dark:border-[#404040] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Filter className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#4B4B4B] dark:text-[#E0E0E0]">카테고리</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {categories.length}개
          </p>
        </div>
        <div className="bg-[#FAF7F2] dark:bg-[#333333] rounded-lg shadow-sm border border-[#D1D1D1] dark:border-[#404040] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#4B4B4B] dark:text-[#E0E0E0]">평균 조리시간</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {recipes.length > 0
              ? Math.round(recipes.reduce((sum, recipe) => sum + recipe.cookingTime, 0) / recipes.length)
              : 0
            }분
          </p>
        </div>
        <div className="bg-[#FAF7F2] dark:bg-[#333333] rounded-lg shadow-sm border border-[#D1D1D1] dark:border-[#404040] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#4B4B4B] dark:text-[#E0E0E0]">쉬운 레시피</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {recipes.filter(r => r.difficulty === 'easy').length}개
          </p>
        </div>
      </div>

      {showModal && <RecipeModal />}
    </div>
  );
};

export default ContentManagementPage;