import { ref } from "vue";
import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase/config";

const error = ref<string | null>(null);
const loading = ref(false);

const login = async () => {
  error.value = null;
  loading.value = true;

  try {
    const provider = new GoogleAuthProvider();
    const response = await signInWithRedirect(auth, provider);

    if (!response) {
      throw new Error("Could not login");
    }

    loading.value = false;
  } catch (err) {
    const { message } = err as Error;
    console.log(message);
    error.value = message;
    loading.value = false;
  }
};

const useLogin = () => {
  return { error, loading, login };
};

export default useLogin;