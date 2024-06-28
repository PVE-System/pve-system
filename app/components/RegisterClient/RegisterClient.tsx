'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import sharedStyles from '@/app/styles/sharedStyles';
import styles from './styles';

const RegisterClient: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    cpf: '',
    cep: '',
    address: '',
    locationNumber: '',
    district: '',
    city: '',
    state: '',
    corfioCode: '',
    phone: '',
    email: '',
    socialMedia: '',
    contactAtCompany: '',
    financialContact: '',
    responsibleSeller: '',
    companySize: '',
    hasOwnStore: '',
    isJSMClient: '',
    includedByJSM: '',
    icmsContributor: '',
    transportationType: '',
    companyLocation: '',
    marketSegmentNature: '',
    rating: 1,
    clientCondition: 'normal',
  });

  const fieldLabels: { [key: string]: string } = {
    companyName: 'Nome da Empresa ou Pessoa',
    cnpj: 'CNPJ',
    cpf: 'CPF',
    cep: 'CEP',
    address: 'Rua',
    locationNumber: 'Número',
    district: 'Bairro',
    city: 'Cidade',
    state: 'Estado',
    corfioCode: 'Código Corfio',
    phone: 'Telefone/fax',
    email: 'Email',
    socialMedia: 'Redes Sociais',
    contactAtCompany: 'Contato na Empresa',
    financialContact: 'Contato Financeiro',
    responsibleSeller: 'Vendedor Responsável',
    companySize: 'Porte da Empresa',
    hasOwnStore: 'Possui Loja Própria',
    isJSMClient: 'Cliente JSM',
    includedByJSM: 'Incluído pelo JSM',
    icmsContributor: 'Contribuinte ICMS',
    transportationType: 'Transporte entra',
    companyLocation: 'Localização da Empresa',
    marketSegmentNature: 'Segmento de Mercado e Natureza Jurídica',
    rating: 'Status de Atividade',
    clientCondition: 'Condição do Cliente',
  };

  const selectOptions: { [key: string]: string[] } = {
    companySize: ['Pequeno', 'Médio', 'Grande'],
    hasOwnStore: ['Sim', 'Não'],
    isJSMClient: ['Sim', 'Não'],
    includedByJSM: ['Sim', 'Não'],
    icmsContributor: ['Sim', 'Não'],
    transportationType: ['Carreta', 'Truck', 'Ambos', 'Nenhum'],
    companyLocation: ['Área Rural', 'Centro'],
    marketSegmentNature: [
      'Atacado',
      'Varejo',
      'Industrialização',
      'Produtor rural',
      'Instaladora',
      'Pessoa jurídica cont',
      'Pessoa física não cont',
      'Construtora',
      'PJ Não cont',
      'Atacarejo',
    ],
    state: [
      'Acre',
      'Alagoas',
      'Amapá',
      'Amazonas',
      'Bahia',
      'Ceará',
      'Distrito Federal',
      'Espírito Santo',
      'Goiás',
      'Maranhão',
      'Mato Grosso',
      'Mato Grosso do Sul',
      'Minas Gerais',
      'Pará',
      'Paraíba',
      'Paraná',
      'Pernambuco',
      'Piauí',
      'Rio de Janeiro',
      'Rio Grande do Norte',
      'Rio Grande do Sul',
      'Rondônia',
      'Roraima',
      'Santa Catarina',
      'São Paulo',
      'Sergipe',
      'Tocantins',
    ],
    rating: ['1', '2', '3'],
    clientCondition: ['Normal', 'Especial', 'Suspenso'],
  };

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const setRating = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const setClientCondition = (condition: string) => {
    setFormData({ ...formData, clientCondition: condition });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/registerClients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setFormData({
          companyName: '',
          cnpj: '',
          cpf: '',
          cep: '',
          address: '',
          locationNumber: '',
          district: '',
          city: '',
          state: '',
          corfioCode: '',
          phone: '',
          email: '',
          socialMedia: '',
          contactAtCompany: '',
          financialContact: '',
          responsibleSeller: '',
          companySize: '',
          hasOwnStore: '',
          isJSMClient: '',
          includedByJSM: '',
          icmsContributor: '',
          transportationType: '',
          companyLocation: '',
          marketSegmentNature: '',
          rating: 0,
          clientCondition: '',
        });
        const clientId = result.clientId;
        router.push(`/registerClientSuccess?clientId=${clientId}`);
      } else {
        setMessage(`Erro: ${result.error}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={styles.container}>
        <Box sx={styles.boxContent}>
          <ClientProfile
            rating={formData.rating}
            clientCondition={formData.clientCondition}
            onRatingChange={setRating}
            companyName={''}
            corfioCode={''}
            onConditionChange={setClientCondition}
            readOnly={false}
          />
          <Box sx={styles.boxCol2}>
            <form onSubmit={handleSubmit}>
              {Object.keys(formData).map((key) => (
                <Box key={key}>
                  <Typography variant="subtitle1">
                    {fieldLabels[key] || key}
                  </Typography>
                  <TextField
                    name={key}
                    value={formData[key as keyof typeof formData]}
                    onChange={handleChange}
                    variant="filled"
                    sx={styles.inputsCol2}
                    fullWidth
                    select={key in selectOptions}
                  >
                    {key in selectOptions &&
                      selectOptions[key].map((option) => (
                        <MenuItem key={option} value={option.toLowerCase()}>
                          {option}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>
              ))}
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={styles.registerButton}
              >
                {loading ? 'Carregando...' : 'Concluir Cadastro'}
              </Button>
            </form>
          </Box>
        </Box>
        {message && (
          <Typography color="error" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default RegisterClient;
