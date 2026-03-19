import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./styles/TechStack.css";
import { 
  FaJava, FaPython, FaJsSquare, FaHtml5, FaCss3Alt, FaReact, FaNodeJs, FaGitAlt, FaGithub, FaNetworkWired, FaEdit, FaTrash, FaPlus
} from "react-icons/fa";
import { 
  SiC, SiJupyter, SiGooglecolab, SiScikitlearn, SiNumpy, SiPandas 
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { MdOutlinePsychology } from "react-icons/md";
import { BsBarChartFill } from "react-icons/bs";
import { useAuthContext } from "../context/AuthProvider";
import { supabase } from "../utils/supabaseClient";

// Icon mapping to allow serialization
const iconMap: { [key: string]: JSX.Element } = {
  // (same icon map)
  FaJava: <FaJava />,
  FaPython: <FaPython />,
  FaJsSquare: <FaJsSquare />,
  FaHtml5: <FaHtml5 />,
  FaCss3Alt: <FaCss3Alt />,
  FaReact: <FaReact />,
  FaNodeJs: <FaNodeJs />,
  FaGitAlt: <FaGitAlt />,
  FaGithub: <FaGithub />,
  FaNetworkWired: <FaNetworkWired />,
  SiC: <SiC />,
  SiJupyter: <SiJupyter />,
  SiGooglecolab: <SiGooglecolab />,
  SiScikitlearn: <SiScikitlearn />,
  SiNumpy: <SiNumpy />,
  SiPandas: <SiPandas />,
  VscVscode: <VscVscode />,
  MdOutlinePsychology: <MdOutlinePsychology />,
  BsBarChartFill: <BsBarChartFill />,
};

interface TechItem {
  name: string;
  iconName: string;
}

interface TechCategory {
  category: string;
  items: TechItem[];
}

const defaultTechStack: TechCategory[] = [
  // (default data)
  {
    category: "Programming Languages",
    items: [
      { name: "Java", iconName: "FaJava" },
      { name: "Python", iconName: "FaPython" },
      { name: "C", iconName: "SiC" },
      { name: "JavaScript", iconName: "FaJsSquare" },
    ]
  },
  {
    category: "Web Development",
    items: [
      { name: "HTML", iconName: "FaHtml5" },
      { name: "CSS", iconName: "FaCss3Alt" },
      { name: "React", iconName: "FaReact" },
      { name: "Node.js", iconName: "FaNodeJs" },
    ]
  },
  {
    category: "Artificial Intelligence & Machine Learning",
    items: [
      { name: "Machine Learning", iconName: "FaPython" },
      { name: "NumPy", iconName: "SiNumpy" },
      { name: "Pandas", iconName: "SiPandas" },
      { name: "Scikit-learn", iconName: "SiScikitlearn" },
      { name: "Matplotlib", iconName: "BsBarChartFill" },
      { name: "Seaborn", iconName: "BsBarChartFill" },
      { name: "Jupyter", iconName: "SiJupyter" },
      { name: "Google Colab", iconName: "SiGooglecolab" },
    ]
  },
  {
    category: "Computer Science Fundamentals",
    items: [
      { name: "DSA (Java)", iconName: "FaNetworkWired" },
      { name: "Problem Solving", iconName: "MdOutlinePsychology" },
    ]
  },
  {
    category: "Tools & Platforms",
    items: [
      { name: "Git", iconName: "FaGitAlt" },
      { name: "GitHub", iconName: "FaGithub" },
      { name: "VS Code", iconName: "VscVscode" },
      { name: "Google Colab", iconName: "SiGooglecolab" },
    ]
  }
];

const TechStack = () => {
  const { user } = useAuthContext();
  const isAdmin = user?.role === "admin";

  const [localTechStack, setLocalTechStack] = useState<TechCategory[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);
  
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  
  const [categoryName, setCategoryName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemIcon, setItemIcon] = useState("FaJsSquare");

  const fetchTechStack = async () => {
    const { data, error } = await supabase
      .from('tech_stack')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching tech stack:', error);
      setLocalTechStack(defaultTechStack);
    } else if (data && data.length > 0) {
      setLocalTechStack(data);
      setIsInitialized(true);
    } else {
      setLocalTechStack([]);
      setIsInitialized(false);
    }
  };

  const syncToSupabase = async () => {
    if (!window.confirm("Sync all default tech categories and items to Supabase?")) return;
    
    // We insert each category as a row
    const formatted = defaultTechStack.map(cat => ({
      category: cat.category,
      items: cat.items
    }));

    const { error } = await supabase.from('tech_stack').insert(formatted);
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Tech Stack synced!");
      fetchTechStack();
    }
  };

  useEffect(() => {
    fetchTechStack();
  }, []);

  const handleAddCategory = async () => {
    const newCat = { category: "New Category", items: [] };
    const { error } = await supabase
      .from('tech_stack')
      .insert([newCat]);
    
    if (error) {
      alert('Error adding category: ' + error.message);
      return;
    }
    fetchTechStack();
  };

  const openEditCategory = (index: number) => {
    setActiveCategoryIndex(index);
    setCategoryName(localTechStack[index].category);
    setIsCategoryModalOpen(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeCategoryIndex === null) return;
    const catToUpdate = localTechStack[activeCategoryIndex];
    
    let error;
    if ((catToUpdate as any).id) {
       const res = await supabase
        .from('tech_stack')
        .update({ category: categoryName })
        .eq('id', (catToUpdate as any).id);
       error = res.error;
    } else {
       // If it was a default item, insert it as new
       const res = await supabase
        .from('tech_stack')
        .insert([{ category: categoryName, items: catToUpdate.items }]);
       error = res.error;
    }
    
    if (error) {
      alert('Database Error: ' + error.message + '\nMake sure you ran the SQL setup in Supabase!');
    } else {
      fetchTechStack();
      setIsCategoryModalOpen(false);
    }
  };

  const handleDeleteCategory = async (index: number) => {
    if (window.confirm("Delete this entire category?")) {
      const catToDelete = localTechStack[index];
      if ((catToDelete as any).id) {
        const { error } = await supabase
          .from('tech_stack')
          .delete()
          .eq('id', (catToDelete as any).id);

        if (error) {
          alert('Error deleting category: ' + error.message);
          return;
        }
      } else {
        // Just remove from local state if it's a default that hasn't been saved to DB yet
        const updated = localTechStack.filter((_, i) => i !== index);
        setLocalTechStack(updated);
        return;
      }
      fetchTechStack();
    }
  };

  const openAddItem = (catIndex: number) => {
    setActiveCategoryIndex(catIndex);
    setActiveItemIndex(null);
    setItemName("");
    setItemIcon("FaJsSquare");
    setIsItemModalOpen(true);
  };

  const openEditItem = (catIndex: number, itemIndex: number) => {
    setActiveCategoryIndex(catIndex);
    setActiveItemIndex(itemIndex);
    const item = localTechStack[catIndex].items[itemIndex];
    setItemName(item.name);
    setItemIcon(item.iconName);
    setIsItemModalOpen(true);
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeCategoryIndex === null) return;
    
    const catToUpdate = localTechStack[activeCategoryIndex];
    const updatedItems = [...catToUpdate.items];
    const newItem = { name: itemName, iconName: itemIcon };
    
    if (activeItemIndex !== null) {
      updatedItems[activeItemIndex] = newItem;
    } else {
      updatedItems.push(newItem);
    }
    
    let error;
    if ((catToUpdate as any).id) {
      const res = await supabase
        .from('tech_stack')
        .update({ items: updatedItems })
        .eq('id', (catToUpdate as any).id);
      error = res.error;
    } else {
      const res = await supabase
        .from('tech_stack')
        .insert([{ category: catToUpdate.category, items: updatedItems }]);
      error = res.error;
    }
    
    if (error) {
      alert('Error saving item: ' + error.message);
    } else {
      fetchTechStack();
      setIsItemModalOpen(false);
    }
  };

  const handleDeleteItem = async (catIndex: number, itemIndex: number) => {
    if (window.confirm("Delete this item?")) {
      const catToUpdate = localTechStack[catIndex];
      const updatedItems = catToUpdate.items.filter((_, i) => i !== itemIndex);
      
      let error;
      if ((catToUpdate as any).id) {
        const res = await supabase
          .from('tech_stack')
          .update({ items: updatedItems })
          .eq('id', (catToUpdate as any).id);
        error = res.error;
      } else {
        const res = await supabase
          .from('tech_stack')
          .insert([{ category: catToUpdate.category, items: updatedItems }]);
        error = res.error;
      }

      if (error) {
        alert('Error deleting item: ' + error.message);
      } else {
        fetchTechStack();
      }
    }
  };

  return (
    <div className="tech-stack-section" id="tech">
      <div className="tech-stack-container section-container">
        <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>My <span>Tech Stack</span></span>
          {isAdmin && (
            <div style={{ display: 'flex', gap: '10px' }}>
              {!isInitialized && (
                <button 
                  onClick={syncToSupabase}
                  style={{ fontSize: '0.8rem', padding: '10px 15px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '5px', cursor: 'pointer' }}
                >
                  🔄 Sync Defaults
                </button>
              )}
              <button 
                onClick={handleAddCategory}
                className="admin-admin-btn"
                style={{ fontSize: '1rem', padding: '10px 20px', background: '#ff4b4b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                + Add Category
              </button>
            </div>
          )}
        </h2>
        
        <div className="tech-grid">
          {localTechStack.length > 0 ? (
            localTechStack.map((techCat, index) => (
              <div className="tech-category" key={index} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0 }}>{techCat.category}</h3>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEditCategory(index)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }} title="Edit Category"><FaEdit /></button>
                      <button onClick={() => handleDeleteCategory(index)} style={{ background: 'none', border: 'none', color: '#ff4b4b', cursor: 'pointer' }} title="Delete Category"><FaTrash /></button>
                    </div>
                  )}
                </div>
                
                <div className="tech-items">
                  {techCat.items.map((item, itemIndex) => (
                    <div className="tech-item" key={itemIndex} data-cursor="disable" style={{ position: 'relative' }}>
                      <div className="tech-icon">{iconMap[item.iconName] || <FaJsSquare />}</div>
                      <span className="tech-name">{item.name}</span>
                      
                      {isAdmin && (
                        <div className="item-admin-overlay" style={{ position: 'absolute', top: '-10px', right: '-10px', display: 'flex', gap: '4px', opacity: 1 }}>
                          <button onClick={() => openEditItem(index, itemIndex)} style={{ background: '#333', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '10px' }}><FaEdit /></button>
                          <button onClick={() => handleDeleteItem(index, itemIndex)} style={{ background: '#ff4b4b', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '10px' }}><FaTrash /></button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isAdmin && (
                    <div 
                      onClick={() => openAddItem(index)}
                      className="tech-item add-item-slot" 
                      style={{ border: '2px dashed rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer' }}
                    >
                      <div className="tech-icon"><FaPlus style={{ opacity: 0.3 }} /></div>
                      <span className="tech-name" style={{ opacity: 0.3 }}>Add</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "rgba(255,255,255,0.5)", gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
              {isInitialized ? "No tech categories found in database." : "Database not yet initialized. Use 'Sync Defaults' to start."}
            </p>
          )}
        </div>
      </div>

      {/* Category Edit Modal */}
      {isCategoryModalOpen && createPortal(
        <div className="cert-modal-overlay" style={{ zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="cert-modal-content" style={{ background: '#1a1a1a', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>Edit Category Name</h3>
            <form onSubmit={handleUpdateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                required 
                value={categoryName} 
                onChange={e => setCategoryName(e.target.value)} 
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' }} 
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} style={{ padding: '8px 15px', background: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 15px', background: '#ff4b4b', color: '#fff', border: 'none', borderRadius: '5px' }}>Save</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Item Add/Edit Modal */}
      {isItemModalOpen && createPortal(
        <div className="cert-modal-overlay" style={{ zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="cert-modal-content" style={{ background: '#1a1a1a', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>{activeItemIndex !== null ? 'Edit Item' : 'Add New Item'}</h3>
            <form onSubmit={handleItemSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                required 
                placeholder="Tech Name"
                value={itemName} 
                onChange={e => setItemName(e.target.value)} 
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' }} 
              />
              <select 
                value={itemIcon} 
                onChange={e => setItemIcon(e.target.value)}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' }}
              >
                {Object.keys(iconMap).map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsItemModalOpen(false)} style={{ padding: '8px 15px', background: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 15px', background: '#ff4b4b', color: '#fff', border: 'none', borderRadius: '5px' }}>Save</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TechStack;
