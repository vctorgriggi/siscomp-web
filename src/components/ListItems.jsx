import { Link } from "react-router-dom";
import { Fragment } from "react";

import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ListItemButton from "@mui/material/ListItemButton";
import CategoryIcon from "@mui/icons-material/Category";
import ContactsIcon from "@mui/icons-material/Contacts";
import ListSubheader from "@mui/material/ListSubheader";
import ArticleIcon from "@mui/icons-material/Article";
import ListItemIcon from "@mui/material/ListItemIcon";
import { APP_ROUTES } from "../constants/app-routes";
import GroupIcon from "@mui/icons-material/Group";
import StoreIcon from "@mui/icons-material/Store";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";

export const mainListItems = (
  <Fragment>
    <ListItemButton
      title="Início"
      component={Link}
      to={APP_ROUTES.private.inicio}
    >
      <ListItemIcon>
        <HomeIcon style={{ color: "var(--gray-400)" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "var(--gray-400)",
          fontSize: "0.875rem",
          lineHeight: "2rem",
        }}
      >
        Início
      </Typography>
    </ListItemButton>
    {/* <ListItemButton title="Dashboard">
      <ListItemIcon>
        <DashboardIcon style={{ color: "var(--gray-400)" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "var(--gray-400)",
          fontSize: "0.875rem",
          lineHeight: "2rem",
        }}
      >
        Dashboard
      </Typography>
    </ListItemButton> */}
  </Fragment>
);

export const secondaryListItems = (
  <Fragment>
    <ListSubheader component="div" inset sx={{ color: "var(--gray-400)" }}>
      Acesso e Segurança
    </ListSubheader>
    <ListItemButton
      title="Usuários"
      component={Link}
      to={APP_ROUTES.private.usuarios}
    >
      <ListItemIcon>
        <GroupIcon style={{ color: "var(--gray-400)" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "var(--gray-400)",
          fontSize: "0.875rem",
          lineHeight: "2rem",
        }}
      >
        Usuários
      </Typography>
    </ListItemButton>
  </Fragment>
);

export const tertiaryListItems = (
  <Fragment>
    <ListSubheader component="div" inset sx={{ color: "var(--gray-400)" }}>
      Repertórios salvos
    </ListSubheader>
    <ListItemButton
      title="Requisições de Compras"
      component={Link}
      to={APP_ROUTES.private.requisicoes_de_compras}
    >
      <ListItemIcon>
        <ArticleIcon style={{ color: "var(--gray-400)" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "var(--gray-400)",
          fontSize: "0.875rem",
          lineHeight: "2rem",
        }}
      >
        Requisições de Compras
      </Typography>
    </ListItemButton>
  </Fragment>
);

export const quaternaryListItems = (
  <Fragment>
    <ListSubheader component="div" inset sx={{ color: "var(--gray-400)" }}>
      Banco de dados
    </ListSubheader>
    <ListItemButton
      title="Produtos"
      component={Link}
      to={APP_ROUTES.private.produtos}
    >
      <ListItemIcon>
        <InventoryIcon style={{ color: "var(--gray-400)" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "var(--gray-400)",
          fontSize: "0.875rem",
          lineHeight: "2rem",
        }}
      >
        Produtos
      </Typography>
    </ListItemButton>
    <ListItemButton
      title="Categorias de Produtos"
      component={Link}
      to={APP_ROUTES.private.categorias_de_produtos}
    >
      <ListItemIcon>
        <CategoryIcon style={{ color: "var(--gray-400)" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "var(--gray-400)",
          fontSize: "0.875rem",
          lineHeight: "2rem",
        }}
      >
        Categorias de Produtos
      </Typography>
    </ListItemButton>
    <ListItemButton
      title="Fornecedores"
      component={Link}
      to={APP_ROUTES.private.fornecedores}
    >
      <ListItemIcon>
        <StoreIcon style={{ color: "var(--gray-400)" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "var(--gray-400)",
          fontSize: "0.875rem",
          lineHeight: "2rem",
        }}
      >
        Fornecedores
      </Typography>
    </ListItemButton>
    <ListItemButton
      title="Contatos"
      component={Link}
      to={APP_ROUTES.private.contato}
    >
      <ListItemIcon>
        <ContactsIcon style={{ color: "var(--gray-400)" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "var(--gray-400)",
          fontSize: "0.875rem",
          lineHeight: "2rem",
        }}
      >
        Contatos
      </Typography>
    </ListItemButton>
  </Fragment>
);
