import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import FormInput from '../components/FormInput';
import Card from '../components/Card';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('F');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password, gender });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.data?.message || 'Erreur lors de l\'inscription 🌸');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card title="Inscription">
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Prénom / Pseudo"
            type="text"
            placeholder="Alice"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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

          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2 ml-2">Genre</label>
            <div className="flex gap-4 ml-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={gender === 'F'}
                  onChange={() => setGender('F')}
                  className="text-primary focus:ring-primary"
                />
                <span>Féminin</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={gender === 'M'}
                  onChange={() => setGender('M')}
                  className="text-primary focus:ring-primary"
                />
                <span>Masculin</span>
              </label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <button
            type="submit"
            className="kawaii-button kawaii-button-primary w-full mb-4"
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'C\'est parti ! ✨'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Déjà inscrit ? <Link to="/auth/login" className="text-primary font-bold">Connecte-toi !</Link>
          </p>
        </form>
      </Card>
    </AuthLayout>
  );
};

export default Register;
