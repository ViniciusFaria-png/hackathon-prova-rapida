import { ArrowBack, Lock as LockIcon, Save as SaveIcon } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { changePassword, getCurrentUser, updateProfile } from "../../actions/auth";
import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../hooks/useAuth";
import { paths } from "../../routes/paths";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setProfileData({
          name: userData.name || "",
          email: userData.email || "",
        });
      } catch (err) {
        toast.error("Erro ao carregar dados do usuário");
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileData.name.trim()) {
      toast.error("O nome é obrigatório");
      return;
    }
    if (!profileData.email.trim()) {
      toast.error("O email é obrigatório");
      return;
    }

    try {
      setSavingProfile(true);
      const response = await updateProfile(profileData);

      if (response.user) {
        refreshUser(response.user);
      }

      toast.success("Perfil atualizado com sucesso!");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Erro ao atualizar perfil"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      toast.error("Informe a senha atual");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      setSavingPassword(true);
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Senha alterada com sucesso!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Erro ao alterar senha"
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <AppLayout>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(paths.dashboard)}
            sx={{ mb: 2 }}
          >
            Voltar
          </Button>

        <Typography variant="h4" fontWeight={700} mb={3}>
          Configurações da Conta
        </Typography>

        {/* Personal Info Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Informações Pessoais
            </Typography>
            <form onSubmit={handleProfileSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Nome completo"
                  fullWidth
                  required
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      savingProfile ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    disabled={savingProfile}
                  >
                    Salvar Alterações
                  </Button>
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Alterar Senha
            </Typography>
            <form onSubmit={handlePasswordSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Senha Atual"
                  type="password"
                  fullWidth
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Nova Senha"
                  type="password"
                  fullWidth
                  required
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  helperText="Mínimo de 6 caracteres"
                />
                <TextField
                  label="Confirmar Nova Senha"
                  type="password"
                  fullWidth
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  error={
                    passwordData.confirmPassword.length > 0 &&
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                  helperText={
                    passwordData.confirmPassword.length > 0 &&
                    passwordData.newPassword !== passwordData.confirmPassword
                      ? "As senhas não coincidem"
                      : ""
                  }
                />
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    startIcon={
                      savingPassword ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <LockIcon />
                      )
                    }
                    disabled={savingPassword}
                  >
                    Alterar Senha
                  </Button>
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Card>
        </Box>
      )}
    </AppLayout>
  );
}
