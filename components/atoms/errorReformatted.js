export const errorReformatted = (error) => {
  const errorCode = error.code;
  switch (errorCode) {
    case "auth/invalid-email":
      return "Adresa de email nu este validă.";
    case "auth/user-disabled":
      return "Acest cont de utilizator a fost dezactivat.";
    case "auth/user-not-found":
      return "Nu există niciun cont de utilizator asociat cu această adresă de email.";
    case "auth/wrong-password":
      return "Parolă incorectă.";
    case "auth/email-already-in-use":
      return "Adresa de email este deja înregistrată.";
    case "auth/weak-password":
      return "Parola este prea slabă. Trebuie să aibă cel puțin 6 caractere.";
    case "auth/too-many-requests":
      return "Am blocat toate cererile de pe acest dispozitiv din cauza unei activități neobișnuite. Încearcă din nou mai târziu.";
    default:
      return "A apărut o eroare la autentificare.";
  }
};
