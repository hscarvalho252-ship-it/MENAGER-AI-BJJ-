
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Student, UserRole, Payment, Product, Post, Instructor, Subscription, AdminTask } from './types';
import { Icons, Logo } from './constants';
import Dashboard from './views/Dashboard';
import StudentList from './views/StudentList';
import StudentForm from './views/StudentForm';
import StudentProfile from './views/StudentProfile';
import Store from './views/Store';
import Payments from './views/Payments';
import Community from './views/Community';
import Login from './views/Login';
import InstructorList from './views/InstructorList';
import InstructorForm from './views/InstructorForm';
import TaskList from './views/TaskList';
import AiAssistant from './views/AiAssistant';
import Help from './views/Help';

const INITIAL_SUBSCRIPTION: Subscription = {
  plan: 'Dojo Hub Premium',
  startDate: new Date().toISOString(),
  studentLimit: 500,
  price: 0
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [academyLogo, setAcademyLogo] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription>(INITIAL_SUBSCRIPTION);
  const [premiumStaffPrice, setPremiumStaffPrice] = useState(30.00);
  const [adminPixKey, setAdminPixKey] = useState('79999055301');
  const [adminPhone, setAdminPhone] = useState('5579999055301');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  // Carregar dados iniciais
  useEffect(() => {
    const saved = localStorage.getItem('gestao_bjj_elite_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStudents(parsed.students || []);
        setInstructors(parsed.instructors || []);
        setTasks(parsed.tasks || []);
        setPayments(parsed.payments || []);
        setPosts(parsed.posts || []);
        setAcademyLogo(parsed.academyLogo || null);
        setSubscription(parsed.subscription || INITIAL_SUBSCRIPTION);
        if (parsed.adminPhone) setAdminPhone(parsed.adminPhone);
        if (parsed.products) setProducts(parsed.products);
      } catch (e) {
        console.error("Erro ao restaurar dados", e);
      }
    }
  }, []);

  // Salvar dados localmente e preparar para nuvem
  useEffect(() => {
    const dataToSave = { 
      students, instructors, tasks, payments, posts, academyLogo, 
      subscription, products, premiumStaffPrice, adminPixKey, adminPhone 
    };
    localStorage.setItem('gestao_bjj_elite_v3', JSON.stringify(dataToSave));
  }, [students, instructors, tasks, payments, posts, academyLogo, subscription, products, premiumStaffPrice, adminPixKey, adminPhone]);

  const addStudent = (s: Student) => setStudents(prev => [...prev, s]);
  const updateStudent = (id: string, updated: Partial<Student>) => 
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setPayments(prev => prev.filter(p => p.payerId !== id));
  };

  const addInstructor = (instructor: Instructor) => setInstructors(prev => [...prev, instructor]);
  const updateInstructor = (id: string, updated: Partial<Instructor>) => 
    setInstructors(prev => prev.map(i => i.id === id ? { ...i, ...updated } : i));
  const deleteInstructor = (id: string) => {
    setInstructors(prev => prev.filter(i => i.id !== id));
    setPayments(prev => prev.filter(p => p.payerId !== id));
  };

  const addPayment = (p: Payment) => setPayments(prev => [...prev, p]);
  const updatePayment = (id: string, updated: Partial<Payment>) => 
    setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  const deletePayment = (id: string) => setPayments(prev => prev.filter(p => p.id !== id));

  const addProduct = (p: Product) => setProducts(prev => [...prev, p]);
  const updateProduct = (id: string, updated: Partial<Product>) => 
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  const addPost = (p: Post) => setPosts(prev => [p, ...prev]);
  const addTask = (task: AdminTask) => setTasks(prev => [...prev, task]);
  const updateTask = (id: string, updated: Partial<AdminTask>) => 
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const handleLogout = () => setCurrentUser(null);

  if (!currentUser) return <Login onLogin={setCurrentUser} instructors={instructors} students={students} academyLogo={academyLogo} />;

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-[#020617] relative">
        
        {/* FAB Sensei Ben */}
        {currentUser.role !== 'Aluno' && (
          <Link 
            to="/assistant" 
            className="fixed bottom-10 right-10 z-[100] w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-110 active:scale-95 transition-all group"
          >
            <div className="absolute -top-12 right-0 bg-slate-900 border border-amber-500/20 px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
               <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Sensei Ben</span>
            </div>
            <Icons.Brain />
          </Link>
        )}

        <aside className="w-72 bg-[#020617] text-slate-400 min-h-screen hidden md:flex flex-col border-r border-amber-500/10 z-20 sticky top-0 h-screen">
          <div className="p-10 flex flex-col items-center">
            <Link to="/" className="flex flex-col items-center gap-5 mb-12">
              <Logo className="w-24 h-24" customSrc={academyLogo} />
              <h1 className="text-2xl font-black text-white uppercase italic bjj-header-font text-center leading-none">
                DOJO <span className="text-amber-500">HUB</span>
              </h1>
            </Link>
          </div>
          <nav className="flex-1 px-8 space-y-2 overflow-y-auto no-scrollbar pb-10">
            {[
              { path: '/', label: 'Painel Central', icon: Icons.Dashboard, show: currentUser.role !== 'Aluno' },
              { path: '/assistant', label: 'Consultor IA', icon: Icons.Brain, show: currentUser.role !== 'Aluno' },
              { path: '/community', label: 'Mural do Dojo', icon: Icons.Community, show: true },
              { path: '/instructors', label: 'Time Técnico', icon: Icons.Users, show: currentUser.role === 'Administrador' },
              { path: '/tasks', label: 'Operações', icon: Icons.Brain, show: currentUser.role === 'Administrador' },
              { path: '/students', label: 'Guerreiros', icon: Icons.Users, show: currentUser.role !== 'Aluno' },
              { path: '/store', label: 'Arsenal', icon: Icons.Store, show: true },
              { path: '/finance', label: 'Tesouraria', icon: Icons.Finance, show: currentUser.role === 'Administrador' },
              { path: '/help', label: 'Configurar Online', icon: Icons.Settings, show: currentUser.role === 'Administrador' },
            ].filter(i => i.show).map((item) => (
              <Link key={item.path} to={item.path} className="flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-bold text-[11px] uppercase tracking-wider text-slate-500 hover:text-amber-500 hover:bg-amber-500/5 group">
                <item.icon />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-x-hidden bg-[#020617]">
          <div className="p-6 md:p-14 max-w-7xl mx-auto w-full pt-24 md:pt-14">
            <div className="mb-6 flex items-center justify-between bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl md:hidden">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Dojo Online</span>
                </div>
                <Link to="/help" className="text-[8px] font-black text-slate-500 uppercase underline">Sincronizar</Link>
            </div>
            
            <Routes>
              <Route path="/" element={<Dashboard 
                students={students} instructors={instructors} payments={payments} tasks={tasks}
                user={currentUser} academyLogo={academyLogo} onLogoChange={setAcademyLogo}
                subscription={subscription} premiumStaffPrice={premiumStaffPrice} onUpdatePremiumPrice={setPremiumStaffPrice}
                adminPixKey={adminPixKey} onUpdateAdminPix={setAdminPixKey} adminPhone={adminPhone} onUpdateAdminPhone={setAdminPhone}
                onUpgrade={() => {}} onLogout={handleLogout}
              />} />
              <Route path="/assistant" element={<AiAssistant students={students} payments={payments} tasks={tasks} user={currentUser} />} />
              <Route path="/tasks" element={<TaskList tasks={tasks} onAdd={addTask} onUpdate={updateTask} onDelete={deleteTask} />} />
              <Route path="/instructors" element={<InstructorList instructors={instructors} onUpdate={updateInstructor} onDelete={deleteInstructor} premiumStaffPrice={premiumStaffPrice} onUpdatePrice={setPremiumStaffPrice} user={currentUser} />} />
              <Route path="/instructors/new" element={<InstructorForm onSubmit={addInstructor} />} />
              <Route path="/instructors/edit/:id" element={<InstructorForm instructors={instructors} onSubmit={updateInstructor} onDelete={deleteInstructor} />} />
              <Route path="/students" element={<StudentList students={students} onDelete={deleteStudent} onUpdate={updateStudent} user={currentUser} subscription={subscription} />} />
              <Route path="/students/new" element={<StudentForm onSubmit={addStudent} students={students} subscription={subscription} />} />
              <Route path="/students/edit/:id" element={<StudentForm students={students} onSubmit={updateStudent} subscription={subscription} />} />
              <Route path="/students/profile/:id" element={<StudentProfile students={students} onUpdate={updateStudent} onDelete={deleteStudent} user={currentUser} />} />
              <Route path="/store" element={<Store products={products} instructors={instructors} user={currentUser} onAddProduct={addProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct} adminPixKey={adminPixKey} adminPhone={adminPhone} />} />
              <Route path="/finance" element={<Payments payments={payments} students={students} instructors={instructors} user={currentUser} adminPixKey={adminPixKey} onUpdateAdminPix={setAdminPixKey} premiumStaffPrice={premiumStaffPrice} onUpdatePremiumPrice={setPremiumStaffPrice} onAddPayment={addPayment} onUpdatePayment={updatePayment} onDeletePayment={deletePayment} />} />
              <Route path="/community" element={<Community posts={posts} user={currentUser} onPost={addPost} />} />
              <Route path="/help" element={<Help />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
