// components/DashboardLayout.jsx
import {
  Box,
  Flex,
  VStack,
  Text,
  Link,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import {
  FiClock,
  FiCreditCard,
  FiFilePlus,
  FiLogOut,
  FiMenu,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo/logoicon.png";
import { RxDashboard } from "react-icons/rx";
const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const links = [
    { label: "Dashboard", to: "/dashboard", icon: RxDashboard },
    { label: "Create New Report", to: "/reportform", icon: FiFilePlus },

    { label: "Buy More Credit", to: "/buy-credit", icon: FiCreditCard },
    { label: "Profile", to: "/profile", icon: FiUser },
  ];

  return (
    <VStack align="start" spacing={6} px={2} pt={8}>
      {links.map((link) => (
        <Button
          key={link.to}
          //  variant="outline"
          _hover="none"
          w="full"
          color="white"
          backgroundColor="transparent"
          justifyContent="start"
          leftIcon={<link.icon />}
          //   border="1px solid white"
          gap="1px"
          onClick={() => navigate(link.to)}
        >
          {link.label}
        </Button>
      ))}
      <Button
        leftIcon={<FiLogOut />}
        justifyContent="start"
        //</VStack>  variant="outline"
        w="full"
        color="red"
        backgroundColor="transparent"
        //  border="2px solid red"
        onClick={() => {
          localStorage.removeItem("seydamtoken");
          navigate("/");
        }}
      >
        Logout
      </Button>
    </VStack>
  );
};

const DashboardLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex h="100vh" direction="column">
      <Flex h="100vh" overflow="hidden">
        {/* Sidebar */}
        <Box
          w="250px"
          bg="gray.800"
          display={{ base: "none", md: "block" }}
          h="full"
          p={0}
        >
          {" "}
          <Flex
            as="header"
            color="white"
            align="center"
            justify="space-between"
            px={6}
            py={6}
          >
            <img src={logo} className="h-10" />
            <IconButton
              icon={<FiMenu />}
              display={{ base: "flex", md: "none" }}
              onClick={onOpen}
              aria-label="Open Menu"
            />
          </Flex>
          <Sidebar />
        </Box>

        {/* Drawer for mobile */}
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <Sidebar onClose={onClose} />
          </DrawerContent>
        </Drawer>

        {/* Main content */}
        {/* <Box flex="1" p={4} overflowY="auto">
          {children}
        </Box> */}
        <Box
          flex="1"
          overflowY="auto"
          h="100vh"
          p={4}
          bg="gray.50" // optional background for contrast
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardLayout;
