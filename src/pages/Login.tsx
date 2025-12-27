import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import FormInput from '../components/FormInput';
import Card from '../components/Card';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.data?.message || 'Identifiants incorrects 🌸');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card title="Connexion">
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            type="email"
            placeholder="tonemail@magique.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormInput
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <button
            type="submit"
            className="kawaii-button kawaii-button-primary w-full mb-4"
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Se connecter 🎀'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Nouveau ici ? <Link to="/auth/register" className="text-primary font-bold">Crée ton compte !</Link>
          </p>
        </form>
      </Card>
    </AuthLayout>
  );
};

export default Login;
