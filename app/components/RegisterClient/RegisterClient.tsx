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
  formatCEP,
} from '@/app/components/FormFormatter/FormFormatter';
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

  const selectOptions: { [key: string]: string[] } = {
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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'cnpj') {
      formattedValue = formatCNPJ(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    } else if (name === 'cep') {
      formattedValue = formatCEP(value);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: formattedValue,
    }));
  };

  function normalizeData(data: {
    companyName?: string;
    cnpj?: string;
    cpf?: string;
    cep?: string;
    address?: string;
    locationNumber?: string;
    district?: string;
    city?: string;
    state: any;
    corfioCode?: string;
    phone?: string;
    emailCommercial?: string;
    emailFinancial?: string;
    emailXml?: string;
    socialMedia?: string;
    contactAtCompany?: string;
    financialContact?: string;
    responsibleSeller?: string;
    companySize: any;
    hasOwnStore: any;
    icmsContributor: any;
    transportationType: any;
    companyLocation: any;
    marketSegmentNature: any;
    rating: any;
    clientCondition: any;
    imageUrl: any;
  }) {
    return {
      ...data,
      rating: parseInt(data.rating, 10), // Apenas garantindo que rating seja um número
      imageUrl: imageUrl || '', // Inclui o imageUrl no envio dos dados
    };
  }
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
      let imageUploadUrl = '';
      // Upload da imagem ao Blob Storage
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append('file', imageFile);

        const uploadResponse = await fetch('/api/uploadImage', {
          method: 'POST',
          body: formDataImage,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          imageUploadUrl = uploadResult.url; // Define a URL da imagem carregada
          setImageUrl(imageUploadUrl); // Atualiza a URL da imagem no estado
        } else {
          throw new Error('Erro ao fazer upload da imagem');
        }
      }
      const normalizedData = normalizeData({
        ...formData,
        imageUrl: imageUploadUrl || '', // Garante que a URL da imagem seja definida
      });

      const response = await fetch('/api/registerClients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(normalizedData),
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
            onRatingChange={setRating}
            companyName={''}
            corfioCode={''}
            onConditionChange={setClientCondition}
            emailCommercial=""
            phone=""
            readOnly={false}
            imageUrl={imageUrl || undefined}
            onImageChange={() => {}}
            showTooltip={true} // Mostra o Tooltip
            enableImageUpload={false}
          />
          <Box sx={styles.boxCol2}>
            {/* Inputs SEM select */}
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
                    {/* Inputs COM select */}
                    {key in selectOptions &&
                      selectOptions[key].map((option) => (
                        <MenuItem key={option} value={option}>
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
