interface HTMLInputElementLogin extends EventTarget {
  email: { value: string };
  password: { value: string };
}
interface HTMLInputElementSignUp extends EventTarget {
  email: { value: string };
  password: { value: string };
  username: { value: string };
}
interface HTMLInputElementAddDream extends EventTarget {
  dream: { value: string };
}
interface HTMLInputElementUpdateUser extends EventTarget {
  username: { value: string };
  full_name: { value: string };
}
