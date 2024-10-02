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
import {
  formatCPF,
  formatCNPJ,
  formatPhone,
} from '@/app/components/FormFormatter/FormFormatter'; // Funções de formatação
import sharedStyles from '@/app/styles/sharedStyles';
import styles from './styles';

// Tipagem para as opções de select
type SelectOptionsType = {
  companySize: string[];
  hasOwnStore: string[];
  icmsContributor: string[];
  transportationType: string[];
  companyLocation: string[];
  marketSegmentNature: string[];
  state: string[];
  rating: string[];
  clientCondition: string[];
};

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
    emailCommercial: '',
    emailFinancial: '',
    emailXml: '',
    socialMedia: '',
    contactAtCompany: '',
    financialContact: '',
    responsibleSeller: '',
    companySize: '',
    hasOwnStore: '',
    icmsContributor: '',
    transportationType: '',
    companyLocation: '',
    marketSegmentNature: '',
    rating: 1,
    clientCondition: 'Normal',
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
    emailCommercial: 'Email Comercial',
    emailFinancial: 'Email Financeiro',
    emailXml: 'Email Xml',
    socialMedia: 'Redes Sociais',
    contactAtCompany: 'Contato na Empresa',
    financialContact: 'Contato Financeiro',
    responsibleSeller: 'Responsável PVE',
    companySize: 'Porte da Empresa',
    hasOwnStore: 'Possui Loja Própria',
    icmsContributor: 'Contribuinte ICMS',
    transportationType: 'Transporte entra',
    companyLocation: 'Localização da Empresa',
    marketSegmentNature: 'Segmento de Mercado e Natureza Jurídica',
    rating: 'Status de Atividade',
    clientCondition: 'Condição do Cliente',
  };

  const selectOptions: SelectOptionsType = {
    companySize: ['Pequeno', 'Médio', 'Grande'],
    hasOwnStore: ['Sim', 'Não'],
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
      'AC',
      'AL',
      'AP',
      'AM',
      'BA',
      'CE',
      'DF',
      'ES',
      'GO',
      'MA',
      'MT',
      'MS',
      'MG',
      'PA',
      'PB',
      'PR',
      'PE',
      'PI',
      'RJ',
      'RN',
      'RS',
      'RO',
      'RR',
      'SC',
      'SP',
      'SE',
      'TO',
    ], // Siglas para estados
    rating: ['1', '2', '3'],
    clientCondition: ['Normal', 'Especial', 'Suspenso'],
  };

  const [states, setStates] = useState<string[]>(selectOptions.state);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // Função para buscar cidades com base no estado selecionado
  const fetchCities = async (state: string) => {
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`,
      );
      const data = await response.json();
      const cityNames = data.map((city: any) => city.nome);
      setCities(cityNames);
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
    }
  };

  // Função para buscar o endereço pelo CEP via ViaCEP
  const handleCEPChange = async (cep: string) => {
    const cleanedCEP = cep.replace(/\D/g, ''); // Remove qualquer caractere não numérico
    if (cleanedCEP.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanedCEP}/json/`,
        );
        const data = await response.json();

        if (!data.erro) {
          console.log('Dados retornados pela API ViaCEP:', data); // Log para depuração

          setFormData((prevFormData) => ({
            ...prevFormData,
            address: data.logradouro || '', // Rua
            district: data.bairro || '', // Bairro
            city: data.localidade || '', // Atualiza a cidade
            state: data.uf || '', // Atualiza o estado
          }));

          // Atualiza as cidades ao alterar o estado
          if (data.uf) {
            fetchCities(data.uf);
          }
        } else {
          console.error('CEP inválido');
        }
      } catch (error) {
        console.error('Erro ao buscar endereço pelo CEP:', error);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let formattedValue = value;

    // Aplicar formatação nos campos de CPF, CNPJ, Telefone e CEP
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'cnpj') {
      formattedValue = formatCNPJ(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    } else if (name === 'cep') {
      formattedValue = value; // Não aplicar formatação ao CEP para evitar conflito com API
      handleCEPChange(formattedValue);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: formattedValue,
    }));

    // Sempre que o estado for alterado manualmente, reiniciar a cidade e carregar as cidades do estado
    if (name === 'state') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        city: '', // Limpa o campo cidade quando o estado muda
      }));
      fetchCities(value);
    }
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
          emailCommercial: '',
          emailFinancial: '',
          emailXml: '',
          socialMedia: '',
          contactAtCompany: '',
          financialContact: '',
          responsibleSeller: '',
          companySize: '',
          hasOwnStore: '',
          icmsContributor: '',
          transportationType: '',
          companyLocation: '',
          marketSegmentNature: '',
          rating: 1,
          clientCondition: 'Normal',
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
            onRatingChange={(rating) => setFormData({ ...formData, rating })}
            companyName={formData.companyName}
            corfioCode={formData.corfioCode}
            onConditionChange={(condition) =>
              setFormData({ ...formData, clientCondition: condition })
            }
            emailCommercial={formData.emailCommercial}
            phone={formData.phone}
            readOnly={false}
            imageUrl={null}
            onImageChange={() => {}}
            showTooltip={true}
            enableImageUpload={false}
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
                    select={
                      key === 'state' || key === 'city' || key in selectOptions
                    }
                  >
                    {key === 'state' &&
                      states.map((state) => (
                        <MenuItem key={state} value={state}>
                          {state}
                        </MenuItem>
                      ))}
                    {key === 'city' &&
                      cities.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    {key in selectOptions &&
                      selectOptions[key as keyof SelectOptionsType].map(
                        (option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ),
                      )}
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
