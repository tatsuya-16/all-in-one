import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {auth, database} from '../../lib/firebase';
import { getAuth} from "firebase/auth"
import {
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  Flex,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    // const [user, setUser] = useState<User | null>(null) //自動ログイン機能
    const router = useRouter();
    const toast = useToast();
    // const { setProfile } = useProfileContext();
  
    const handleSignUp = async (event: React.FormEvent) => {
    let result: boolean = false
      event.preventDefault();
      try {
        const user = await createUserWithEmailAndPassword(
            auth, signUpEmail, signUpPassword
        ).then(async (userCredential) => {
            /** thenから追加します */
            /** cloud firestoreのコレクション */
            const colRef = doc(database, 'users', userCredential.user.uid)
            /** document追加 */
            await setDoc(colRef, {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
            })
            return userCredential.user
          })
          if (user) {
            result = true
          }
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      }
    };
  
    // useEffect(() => {
    //   const logout = async () => {
    //     await signOut(auth);
    //     setProfile({ role: "", nickname: "" });
    //   };
    //   logout();
    // }, [setProfile]);
  
    //自動ログイン機能
    // useEffect(() => {
    //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    //     setUser(currentUser)
    //     if (currentUser) {
    //       router.push('/profile')
    //     }
    //   })
  
    //   return () => {
    //     unsubscribe()
    //   }
    // }, [router])
  
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        h="100vh"
        w="100vw"
      >
        <Box
          bg="gray.300"
          p={10}
          pt={16}
          pb={16}
          mb={10}
          w={{ base: "80%", md: "2/6" }}
        >
          <Box p={5}>
            <VStack spacing={4} align="stretch">
              <Heading as="h1" size="xl">
                新規登録
              </Heading>
              <Box as="form" onSubmit={handleSignUp} width="100%">
                <FormControl id="email" isRequired>
                  <FormLabel>メールアドレス</FormLabel>
                  <Input
                    bg="gray.100"
                    type="email"
                    value={signUpEmail}
                    onChange={(event) => setSignUpEmail(event.target.value)}
                  />
                </FormControl>
                <FormControl id="password" isRequired mt={4}>
                  <FormLabel>パスワード</FormLabel>
                  <Input
                    bg="gray.100"
                    type="password"
                    value={signUpPassword}
                    onChange={(event) => setSignUpPassword(event.target.value)}
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="teal"
                  color="white"
                  size="lg"
                  width="100%"
                  mt={6}
                  _hover={{ bg: "teal.600" }}
                >
                  確定
                </Button>
              </Box>
              <Box textAlign="center" mt={4}>
                <NextLink href="/" passHref legacyBehavior>
                  <a style={{ color: "teal" }}>ログイン</a>
                </NextLink>
              </Box>
            </VStack>
          </Box>
        </Box>
      </Flex>
    );
  };
  
  export default Register;