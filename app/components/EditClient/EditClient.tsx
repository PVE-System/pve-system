import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Link,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';

import { useRouter, useSearchParams } from 'next/navigation';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import {
  formatCPF,
  formatCNPJ,
  formatPhone,
  formatCEP,
} from '@/app/components/FormFormatter/FormFormatter';
import styles from '@/app/components/EditClient/styles';
import sharedStyles from '@/app/styles/sharedStyles';
import { BusinessGroup, User } from '@/app/db';

const fieldLabels: { [key: string]: string } = {
  companyName: 'Nome da Empresa ou Pessoa',
  businessGroupId: 'Grupo Empresarial',
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
  rating: ['1', '2', '3'],
  clientCondition: ['Normal', 'Especial', 'Suspenso'],
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
  ],
};

interface FormDataState {
  [key: string]: string;
}

interface EditClientProps {
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
}

const ClientEditPage: React.FC<EditClientProps> = ({ setFormData }) => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('id');
  const router = useRouter();

  const { handleSubmit, control, setValue, watch } = useForm();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [states] = useState<string[]>([
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
  ]);
  const [cities, setCities] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para o modal de duplicata
  const [initialCnpj, setInitialCnpj] = useState(''); // Valor inicial do CNPJ
  const [initialCpf, setInitialCpf] = useState(''); // Valor inicial do CPF
  const [duplicateClient, setDuplicateClient] = useState<any>(null);
  const [duplicateField, setDuplicateField] = useState<'cnpj' | 'cpf' | null>(
    null,
  );
  const [users, setUsers] = useState<
    { operatorNumber: string; name: string }[]
  >([]);
  const [debouncedCnpj, setDebouncedCnpj] = useState('');
  const [debouncedCpf, setDebouncedCpf] = useState('');
  const [businessGroups, setBusinessGroups] = useState<BusinessGroup[]>([]);

  const [cepPreenchido, setCepPreenchido] = useState(false);
  const [stateEditadoManualmente, setStateEditadoManualmente] = useState(false);

  // Observa os campos do formulário
  const companyName = watch('companyName');
  const corfioCode = watch('corfioCode');
  const whatsapp = watch('whatsapp');
  const emailCommercial = watch('emailCommercial');
  const cnpj = watch('cnpj');
  const cpf = watch('cpf');
  const stateValue = watch('state');

  const icmsContributor = useWatch({
    control,
    name: 'icmsContributor',
    defaultValue: 'Não',
  });

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
    const cleanedCEP = cep.replace(/\D/g, '');
    if (cleanedCEP.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanedCEP}/json/`,
        );
        const data = await response.json();

        if (!data.erro) {
          setValue('address', data.logradouro || '');
          setValue('district', data.bairro || '');
          setValue('city', data.localidade || '');
          setValue('state', data.uf || '');
          fetchCities(data.uf);
          setCepPreenchido(true); // Marca que o CEP foi preenchido pela API
          setStateEditadoManualmente(false); // Reseta o estado manual
        }
      } catch (error) {
        console.error('Erro ao buscar endereço pelo CEP:', error);
      }
    }
  };

  // Função para capturar mudança manual no campo de estado

  const handleStateChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newState = event.target.value;

    setValue('state', newState);
    setValue('city', '');
    setValue('address', '');
    setValue('district', '');
    setValue('locationNumber', '');
    setValue('cep', '');

    setCepPreenchido(false);
    setStateEditadoManualmente(true);
  };

  // Atualiza as cidades sempre que o estado mudar
  useEffect(() => {
    if (stateValue) {
      fetchCities(stateValue);
      // Se o usuário alterou o estado manualmente, limpamos os campos
      if (stateEditadoManualmente) {
        setValue('cep', '');
        setValue('city', '');
        setValue('address', '');
        setValue('district', '');
        setValue('locationNumber', '');
        setCepPreenchido(false);
      }
    }
  }, [stateValue, setValue, stateEditadoManualmente]);

  useEffect(() => {
    if (!clientId) return;

    //Get Client

    const fetchData = async () => {
      setLoading(true); // Garante que o estado de carregamento é verdadeiro no início da busca

      try {
        const response = await fetch(`/api/getClient/${clientId}`);
        const data = await response.json();

        if (data) {
          setClientData(data);
          setImageUrl(data.imageUrl || null);

          // Atualiza os valores do formulário com os dados do cliente
          Object.keys(data).forEach((key) => {
            setValue(key, data[key]);
          });

          // Carrega as cidades apenas se `state` estiver definido
          if (data.state) {
            fetchCities(data.state);
          }
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId, setValue]);

  //Lidar com submit form

  const onSubmit = async (data: any) => {
    if (!clientId) return;

    setLoadingSave(true);

    try {
      // Verifica duplicidade para CNPJ
      const cnpjDuplicate = await handleDuplicateCheck(
        'cnpj',
        data.cnpj,
        initialCnpj,
      );
      if (cnpjDuplicate) return;

      // Verifica duplicidade para CPF
      const cpfDuplicate = await handleDuplicateCheck(
        'cpf',
        data.cpf,
        initialCpf,
      );
      if (cpfDuplicate) return;

      delete data.id;
      delete data.createdAt;

      let finalImageUrl = imageUrl || clientData?.imageUrl;

      if (data.icmsContributor === 'Não') {
        data.stateRegistration = '';
      }

      //Lidar com a imagem do client

      if (imageFile && imageUrl) {
        try {
          console.log('Deletando imagem antiga:', clientId);
          const deleteImageResponse = await fetch(
            `/api/deleteImageClient?clientId=${clientId}&imageUrl=${encodeURIComponent(imageUrl)}`,
            { method: 'DELETE' },
          );

          if (!deleteImageResponse.ok) {
            const errorResponse = await deleteImageResponse.json();
            throw new Error(
              errorResponse.error || 'Erro ao deletar imagem antiga',
            );
          }
        } catch (error) {
          console.error('Erro ao deletar imagem antiga:', error);
        }
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadResponse = await fetch(
          `/api/uploadImageClient?pathname=clients/id=${clientId}/image-${Date.now()}&clientId=${clientId}`,
          { method: 'POST', body: formData },
        );

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          finalImageUrl = uploadResult.url;
        } else {
          console.error('Erro ao fazer upload da nova imagem');
        }
      }

      const updatedData = {
        ...data,
        imageUrl: finalImageUrl,
      };

      //Salvar as atualizações do client após a edição do usuario

      const response = await fetch(`/api/updateClient?id=${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.error || 'Erro ao atualizar os dados do cliente',
        );
      }

      console.log('Dados atualizados com sucesso.');
      router.push(`/clientPage?id=${clientId}`);
    } catch (error) {
      console.error('Erro ao atualizar os dados do cliente:', error);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleImageChange = (file: File) => {
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  //lidar com delete client

  const onDelete = async () => {
    setLoadingDelete(true); // Inicia o estado de loading ao deletar
    try {
      console.log('Fetching files related to client:', clientId);

      const filesResponse = await fetch(
        `/api/getAllFilesBlobByClient?clientId=${clientId}`,
      );
      const filesData = await filesResponse.json();

      console.log('Files found for client:', filesData.files);

      if (filesResponse.ok && filesData.files.length > 0) {
        console.log('Deleting associated files');
        await fetch(`/api/deleteAllFilesBlobByClient`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileUrls: filesData.files.map((file: { url: any }) => file.url),
          }),
        });
        console.log('Files deleted successfully');
      }

      console.log('Attempting to delete client from the database');
      const deleteClientResponse = await fetch(
        `/api/deleteClient?id=${clientId}`,
        {
          method: 'DELETE',
        },
      );

      if (!deleteClientResponse.ok) {
        const errorResponse = await deleteClientResponse.json();
        throw new Error(errorResponse.error || 'Failed to delete client');
      }

      console.log('Client deleted successfully');
      router.push(`/dashboard`);
    } catch (error) {
      console.error('Error deleting client or files:', error);
    } finally {
      setLoadingDelete(false); // Finaliza o estado de loading
    }
  };

  // Buscar usuarios para o input select Vendedor Responsável

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await fetch('/api/getAllUsers');
        if (!response.ok) throw new Error('Erro ao buscar usuários');
        const data = await response.json();

        // Filtrar usuários ativos no frontend
        const activeUsers = data.users.filter((user: User) => user.is_active);

        // Ordenar os usuários numericamente pelo operatorNumber
        const sortedUsers = activeUsers.sort((a: User, b: User) => {
          const numA = parseInt(a.operatorNumber, 10); // Converte para número
          const numB = parseInt(b.operatorNumber, 10); // Converte para número
          return numA - numB; // Ordena de forma crescente
        });

        setUsers(sortedUsers); // Atualiza o estado com a lista ordenada
      } catch (error) {
        console.error('Erro ao buscar usuários ativos:', error);
      }
    };

    fetchActiveUsers();
  }, []);

  // Ordena os grupos empresariais

  const sortBusinessGroups = (groups: BusinessGroup[]): BusinessGroup[] => {
    return groups.sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }),
    );
  };

  // Buscar os Grupos empresarial

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

  // Lidar com duplicação

  const handleDuplicateCheck = async (
    field: 'cnpj' | 'cpf',
    value: string,
    initialValue: string,
  ) => {
    if (value && (value !== initialValue || !initialValue)) {
      const isDuplicate = await checkDuplicate(field, value);
      if (isDuplicate) {
        setDuplicateField(field);
        setShowModal(true);
        setLoadingSave(false);
        return true;
      }
    }
    return false;
  };

  const checkDuplicate = useCallback(
    async (field: 'cnpj' | 'cpf', value: string) => {
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
        if (result.duplicate && result.client.id !== clientId) {
          setDuplicateClient(result.client);
          setDuplicateField(field);
          setShowModal(true);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Erro ao verificar duplicata:', error);
        return false;
      }
    },
    [clientId],
  );

  // Carregar os valores iniciais de CNPJ e CPF para conferir duplicação
  useEffect(() => {
    if (clientData) {
      setInitialCnpj(clientData.cnpj || '');
      setInitialCpf(clientData.cpf || '');
    }
  }, [clientData]);

  useEffect(() => {
    // Debounce para CNPJ
    const handler = setTimeout(() => {
      setDebouncedCnpj(cnpj || ''); //
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [cnpj]);

  useEffect(() => {
    // Debounce para CPF
    const handler = setTimeout(() => {
      setDebouncedCpf(cpf || '');
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [cpf]);

  useEffect(() => {
    if (debouncedCnpj && debouncedCnpj !== initialCnpj) {
      checkDuplicate('cnpj', debouncedCnpj);
    }
  }, [checkDuplicate, debouncedCnpj, initialCnpj]);

  useEffect(() => {
    if (debouncedCpf && debouncedCpf !== initialCpf) {
      checkDuplicate('cpf', debouncedCpf);
    }
  }, [checkDuplicate, debouncedCpf, initialCpf]);

  // Lógica para fechar o modal
  const handleCloseModal = () => setShowModal(false);

  // Modal de duplicidade
  const renderDuplicateModal = () => (
    <Modal
      open={showModal}
      onClose={handleCloseModal}
      sx={sharedStyles.boxModal}
    >
      <Box sx={sharedStyles.modalAlert}>
        <Typography variant="h6">Cliente já cadastrado!</Typography>
        <Typography variant="body1">
          Um cliente com o mesmo {duplicateField === 'cnpj' ? 'CNPJ' : 'CPF'} já
          existe no sistema.
        </Typography>
        <Button
          variant="contained"
          onClick={handleCloseModal}
          sx={sharedStyles.modalButton}
        >
          Fechar
        </Button>
        {duplicateClient && (
          <a
            href={`/clientPage?id=${duplicateClient.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="contained" sx={sharedStyles.modalButton}>
              Ver Cliente
            </Button>
          </a>
        )}
      </Box>
    </Modal>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!clientId) {
    return <div>ID do cliente não fornecido</div>;
  }

  if (!clientData) {
    return (
      <p>
        Cliente não encontrado. Verifique se o ID do cliente está correto e a
        API está retornando os dados esperados.
      </p>
    );
  }

  return (
    <Box sx={styles.contentTabs}>
      <Box sx={styles.boxContent}>
        {renderDuplicateModal()}
        <Box>
          <ClientProfile
            rating={watch('rating')}
            clientCondition={watch('clientCondition')}
            companyName={companyName || clientData?.companyName || ''}
            corfioCode={corfioCode || clientData?.corfioCode || ''}
            whatsapp={whatsapp || clientData?.whatsapp || ''}
            emailCommercial={
              emailCommercial || clientData?.emailCommercial || ''
            }
            onRatingChange={(rating) => setValue('rating', rating)}
            onConditionChange={(condition) =>
              setValue('clientCondition', condition)
            }
            readOnly={false}
            imageUrl={previewImage || imageUrl || undefined}
            onImageChange={handleImageChange}
            enableImageUpload={true}
          />
          <Box sx={styles.boxButton}>
            <Button
              type="button"
              variant="contained"
              sx={styles.deleteButton}
              onClick={() => setShowDeleteModal(true)} // Abre o modal
            >
              Deletar
            </Button>
            <Modal
              open={showDeleteModal}
              onClose={() => setShowDeleteModal(false)} // Fecha o modal
              sx={sharedStyles.boxModal}
            >
              <Box sx={sharedStyles.modalAlert}>
                <Typography variant="h6">Confirmação de Exclusão!</Typography>
                <Typography variant="body1">
                  Tem certeza de que deseja excluir este cliente?
                </Typography>

                <Button
                  variant="contained"
                  onClick={onDelete}
                  sx={{
                    ...sharedStyles.modalButton,
                    backgroundColor: 'red',
                    '&:hover': {
                      backgroundColor: 'darkred',
                    },
                  }}
                  disabled={loadingDelete} // Desativa o botão enquanto carrega
                >
                  {loadingDelete ? <CircularProgress size={24} /> : 'Deletar'}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setShowDeleteModal(false)} // Fecha o modal
                  sx={sharedStyles.modalButton}
                >
                  Cancelar
                </Button>
              </Box>
            </Modal>
            <Button
              type="button"
              variant="contained"
              sx={styles.editButton}
              onClick={() => handleSubmit(onSubmit)()}
              disabled={loadingSave} // Desativa o botão enquanto está carregando
            >
              {loadingSave ? <CircularProgress size={24} /> : 'Salvar'}
            </Button>
          </Box>
        </Box>
        <Box sx={styles.boxCol2}>
          <form>
            {/* Renderiza primeiro companyName e businessGroupId */}
            {['companyName', 'businessGroupId'].map((key) => (
              <Box key={key}>
                <Typography variant="subtitle1">
                  {fieldLabels[key] || key}
                </Typography>
                <Controller
                  name={key}
                  control={control}
                  defaultValue={clientData[key] || ''}
                  render={({ field }) => {
                    if (key === 'businessGroupId') {
                      return (
                        <TextField
                          {...field}
                          select
                          variant="filled"
                          fullWidth
                          sx={styles.inputsCol2}
                          value={
                            businessGroups.some((g) => g.id === field.value)
                              ? field.value
                              : ''
                          }
                        >
                          {businessGroups.map((group) => (
                            <MenuItem key={group.id} value={group.id}>
                              {group.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      );
                    }

                    return (
                      <TextField
                        {...field}
                        variant="filled"
                        sx={styles.inputsCol2}
                        InputProps={{
                          readOnly: false,
                        }}
                      />
                    );
                  }}
                />
              </Box>
            ))}

            {/* Renderiza os outros campos, ignorando estes campos */}
            {Object.keys(clientData)
              .filter(
                (key) =>
                  key !== 'id' &&
                  key !== 'createdAt' &&
                  key !== 'imageUrl' &&
                  key !== 'companyName' &&
                  key !== 'businessGroupId',
              )
              .map((key) => (
                <Box key={key}>
                  <Typography variant="subtitle1">
                    {fieldLabels[key] || key}
                  </Typography>
                  <Controller
                    name={key}
                    control={control}
                    defaultValue={clientData[key] || ''}
                    render={({ field: { onChange, value, ...restField } }) => {
                      // Formatação específica para CPF, CNPJ, telefone e CEP
                      const handleFormattedChange = (
                        event: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >,
                      ) => {
                        const { name, value } = event.target;
                        let formattedValue = value;

                        if (name === 'cpf') {
                          formattedValue = formatCPF(value);
                        } else if (name === 'cnpj') {
                          formattedValue = formatCNPJ(value);
                        } else if (name === 'phone' || name === 'whatsapp') {
                          formattedValue = formatPhone(value);
                        } else if (name === 'cep') {
                          formattedValue = formatCEP(value);
                          handleCEPChange(value.replace(/\D/g, ''));
                        }

                        onChange(formattedValue);
                      };

                      if (key === 'responsibleSeller') {
                        return (
                          <TextField
                            {...restField}
                            value={
                              users.some((u) => u.operatorNumber === value)
                                ? value
                                : ''
                            }
                            onChange={onChange}
                            select
                            variant="filled"
                            fullWidth
                            sx={styles.inputsCol2}
                          >
                            {users.map((user) => (
                              <MenuItem
                                key={user.operatorNumber}
                                value={user.operatorNumber}
                              >
                                {`${user.operatorNumber} - ${user.name}`}
                              </MenuItem>
                            ))}
                          </TextField>
                        );
                      }

                      return (
                        <TextField
                          {...restField}
                          name={key}
                          value={
                            key === 'city'
                              ? cities.includes(value)
                                ? value
                                : ''
                              : key === 'state'
                                ? states.includes(value)
                                  ? value
                                  : ''
                                : value
                          }
                          onChange={(event) => {
                            handleFormattedChange(event);
                            if (key === 'state') {
                              handleStateChange(event); // Reseta campos quando o estado muda manualmente
                            }
                            if (key === 'cep') {
                              handleCEPChange(event.target.value); // Busca dados da API ao alterar o CEP
                            }
                          }}
                          variant="filled"
                          sx={styles.inputsCol2}
                          InputProps={{ readOnly: false }}
                          select={
                            key === 'state' ||
                            key === 'city' ||
                            key in selectOptions
                          }
                          disabled={
                            key === 'stateRegistration' &&
                            icmsContributor === 'Não'
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
                            selectOptions[key].map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                        </TextField>
                      );
                    }}
                  />
                </Box>
              ))}
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientEditPage;
