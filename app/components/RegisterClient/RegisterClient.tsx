'use client';

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  MenuItem,
  Modal,
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
} from '@/app/components/FormFormatter/FormFormatter'; // Funções de formatação
import sharedStyles from '@/app/styles/sharedStyles';
import styles from './styles';
import { User } from '@/app/db';

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

// Definição de ClientData com `id` incluído
interface ClientData {
  id?: string;
  cnpj?: string;
  cpf?: string;
  // Outras propriedades do cliente
}

interface BusinessGroup {
  id: number;
  name: string;
}

const RegisterClient: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    businessGroup: '',
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
    whatsapp: '',
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
    stateRegistration: '',
    transportationType: '',
    companyLocation: '',
    marketSegmentNature: '',
    rating: 1,
    clientCondition: 'Normal',
  });

  const fieldLabels: { [key: string]: string } = {
    companyName: 'Nome da Empresa ou Pessoa',
    businessGroup: 'Grupo Empresarial',
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
    whatsapp: 'WhatsApp',
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
    stateRegistration: 'Inscrição Estadual',
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
  const [businessGroups, setBusinessGroups] = useState<BusinessGroup[]>([]);
  const [users, setUsers] = useState<
    { operatorNumber: string; name: string }[]
  >([]);
  const [duplicateClient, setDuplicateClient] = useState<ClientData | null>(
    null,
  );
  const [duplicateField, setDuplicateField] = useState<'cnpj' | 'cpf' | null>(
    null,
  );

  const [showModal, setShowModal] = useState(false);
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
        address: '',
        district: '',
        cep: '',
      }));
      fetchCities(value);
    }
  };

  // Função para buscar os usuários da tabela 'users'
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/getAllUsers');
        if (!response.ok) throw new Error('Erro ao buscar usuários');
        const data = await response.json();

        // Filtrar usuários ativos
        const activeUsers = data.users.filter((user: User) => user.is_active);

        // Ordenar usuários pelo operatorNumber (numericamente)
        const sortedUsers = activeUsers.sort((a: User, b: User) => {
          const numA = parseInt(a.operatorNumber, 10); // Converte operatorNumber para número
          const numB = parseInt(b.operatorNumber, 10); // Converte operatorNumber para número
          return numA - numB; // Ordena de forma crescente
        });

        setUsers(sortedUsers); // Atualiza o estado com os usuários ordenados
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    console.log('Usuários carregados:', users);
  }, [users]);

  // Ordena os grupos
  const sortBusinessGroups = (groups: BusinessGroup[]): BusinessGroup[] => {
    return groups.sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }),
    );
  };

  // Função para buscar os Grupos empresarial da tabela 'bussinesGroup'
  const fetchBusinessGroups = useCallback(async () => {
    try {
      const response = await fetch('/api/getAllBusinessGroups');
      if (!response.ok) throw new Error('Erro ao buscar grupos empresariais');

      const data = await response.json();
      setBusinessGroups(sortBusinessGroups(data.businessGroups));
    } catch (error) {
      console.error('Erro ao buscar grupos empresariais:', error);
      setBusinessGroups([]);
    }
  }, []);

  useEffect(() => {
    fetchBusinessGroups();
  }, [fetchBusinessGroups]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    // Verificação final para CNPJ e CPF duplicados
    if (formData.cnpj) {
      const cnpjDuplicate = await checkDuplicate('cnpj', formData.cnpj);
      if (cnpjDuplicate) {
        setDuplicateField('cnpj');
        setShowModal(true);
        setLoading(false); // Interrompe o carregamento
        return; // Impede o envio do formulário
      }
    }

    if (formData.cpf) {
      const cpfDuplicate = await checkDuplicate('cpf', formData.cpf);
      if (cpfDuplicate) {
        setDuplicateField('cpf');
        setShowModal(true);
        setLoading(false); // Interrompe o carregamento
        return; // Impede o envio do formulário
      }
    }

    // Se nenhuma duplicata foi encontrada, prossegue com o cadastro
    try {
      const response = await fetch('/api/registerClients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          businessGroupId: formData.businessGroup
            ? Number(formData.businessGroup)
            : null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setFormData({
          companyName: '',
          businessGroup: '',
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
          whatsapp: '',
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
          stateRegistration: '',
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

  // Função para verificar duplicidade de CNPJ ou CEP
  const checkDuplicate = async (field: 'cnpj' | 'cpf', value: string) => {
    try {
      const response = await fetch('/api/checkDuplicateRegisterClient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        console.error('Erro na resposta do servidor:', response.statusText);
        return false;
      }

      const result = await response.json();
      if (result.duplicate) {
        setDuplicateClient(result.client);
        setDuplicateField(field);
        setShowModal(true); // Exibe o modal no momento do preenchimento
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar duplicata:', error);
      return false;
    }
  };

  // Monitoramento do CNPJ e CEP
  useEffect(() => {
    if (formData.cnpj?.length === 18) {
      checkDuplicate('cnpj', formData.cnpj);
    }
  }, [formData.cnpj]);

  useEffect(() => {
    if (formData.cpf?.length === 14) {
      checkDuplicate('cpf', formData.cpf);
    }
  }, [formData.cpf]);

  const handleCloseModal = () => setShowModal(false);

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
            whatsapp={formData.whatsapp}
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
                  <Typography
                    variant="subtitle1"
                    sx={sharedStyles.subTitleFontFamily}
                  >
                    {fieldLabels[key] || key}
                  </Typography>

                  {/* Campo específico para 'responsibleSeller' */}
                  {key === 'responsibleSeller' ? (
                    <TextField
                      name={key}
                      value={formData.responsibleSeller}
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          responsibleSeller: event.target.value,
                        });
                      }}
                      select
                      fullWidth
                      variant="filled"
                      sx={styles.inputsCol2}
                    >
                      {Array.isArray(users) &&
                        users.map((user) => (
                          <MenuItem
                            key={user.operatorNumber}
                            value={user.operatorNumber}
                          >
                            {`${user.operatorNumber} - ${user.name}`}
                          </MenuItem>
                        ))}
                    </TextField>
                  ) : key === 'businessGroup' ? (
                    <Box>
                      {/* Select do Grupo Empresarial */}
                      <TextField
                        name={key}
                        value={formData.businessGroup}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            businessGroup: event.target.value,
                          })
                        }
                        select
                        fullWidth
                        variant="filled"
                        sx={styles.inputsCol2}
                      >
                        {/* Opção "Criar Novo Grupo" */}
                        {/*                         <MenuItem
                          value="createNewGroup"
                          onClick={() => router.push('/businessGroupPage')} // Redireciona para /businessGroupPage
                          sx={{
                            fontStyle: 'italic',
                            color: 'primary.main', // Estilo para destacar a opção
                          }}
                        >
                          Criar Novo Grupo
                        </MenuItem> */}

                        {/* Opção "Não pertence a nenhum grupo" */}
                        {businessGroups.some((group) => group.id === 4) ? (
                          <MenuItem value={4}>
                            Não pertence a nenhum grupo
                          </MenuItem>
                        ) : (
                          <MenuItem value="Não"></MenuItem>
                        )}

                        {/* Lista de grupos empresariais (excluindo o grupo específico) */}
                        {Array.isArray(businessGroups) &&
                        businessGroups.length > 0 ? (
                          businessGroups
                            .filter((group) => group.id !== 4) // Remove o grupo específico da lista
                            .map((group) => (
                              <MenuItem key={group.id} value={group.id}>
                                {group.name}
                              </MenuItem>
                            ))
                        ) : (
                          <MenuItem disabled>Carregando grupos...</MenuItem>
                        )}
                      </TextField>
                    </Box>
                  ) : (
                    /* Renderizar os outros campos normalmente */
                    <TextField
                      name={key}
                      value={formData[key as keyof typeof formData]}
                      onChange={(event) => {
                        const target = event.target as HTMLInputElement;
                        const { value } = target;
                        let formattedValue = value;

                        // Formatação específica
                        if (key === 'cep') {
                          formattedValue = formatCEP(value);
                          handleCEPChange(value.replace(/\D/g, ''));
                        } else if (key === 'cpf') {
                          formattedValue = formatCPF(value);
                        } else if (key === 'cnpj') {
                          formattedValue = formatCNPJ(value);
                        } else if (key === 'phone' || key === 'whatsapp') {
                          formattedValue = formatPhone(value);
                        } else {
                          handleChange(
                            event as React.ChangeEvent<HTMLInputElement>,
                          );
                        }

                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          [key]: formattedValue,
                        }));
                      }}
                      required={key === 'companyName'}
                      placeholder={
                        key === 'phone' || key === 'whatsapp'
                          ? '(xx)xxxxxxxxx'
                          : ''
                      }
                      variant="filled"
                      sx={styles.inputsCol2}
                      fullWidth
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault(); // Impede o envio
                        }
                      }}
                      select={
                        key === 'state' ||
                        key === 'city' ||
                        key in selectOptions
                      }
                      disabled={
                        key === 'stateRegistration' &&
                        formData.icmsContributor !== 'Sim'
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
                  )}
                </Box>
              ))}

              <Box sx={styles.boxRegisterButton}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    ...styles.registerButton,
                    /* ...sharedStyles.buttonFontFamily, */
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Concluir Cadastro'
                  )}
                </Button>
              </Box>
            </form>

            {/* Modal para clientes ja cadastrado, evitando duplicação*/}
            <Modal
              open={showModal}
              onClose={handleCloseModal}
              sx={sharedStyles.boxModal}
            >
              <Box sx={sharedStyles.modalAlert}>
                <Typography variant="h6" sx={{}}>
                  Cliente já cadastrado!
                </Typography>
                <Typography variant="body1">
                  Um cliente com o mesmo{' '}
                  {duplicateField === 'cnpj' ? 'CNPJ' : 'CPF'} já existe no
                  sistema.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleCloseModal}
                  sx={sharedStyles.modalButton}
                >
                  Fechar
                </Button>
                <Link href={`/clientPage?id=${duplicateClient?.id}`}>
                  <Button variant="contained" sx={sharedStyles.modalButton}>
                    Ver Cliente
                  </Button>
                </Link>
              </Box>
            </Modal>
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
