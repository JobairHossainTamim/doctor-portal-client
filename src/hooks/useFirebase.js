import initializeFirebase from "../Pages/Login/Login/Firebase/firebase.init";
import { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged,getIdToken , GoogleAuthProvider,signInWithPopup ,signOut, updateProfile  } from "firebase/auth";


// initialize firebase app
initializeFirebase();

const useFirebase = () => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState('');
    const [admin ,setAdmin]=useState(false);
    const [token, setToken]=useState('');

    const auth = getAuth();
    // GoogleProvider
    const googleProvider = new GoogleAuthProvider();

// Data Load And visualization from Api performance
useEffect(()=>{
fetch(`http://localhost:5000/users/${user.email}`)
.then(res=>res.json())
.then(data=>setAdmin(data.admin))
},[user.email])


    const registerUser = (email, password,history,name) => {
        setIsLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setAuthError('');
                history.replace("/");
                const newUser={email , displayName:name};
                setUser(newUser);
                // Save User To the db
                saveUser(email,name,"POST");
                // update name
                updateProfile(auth.currentUser, {
                    displayName: name
                  }).then(() => {
                    
                  }).catch((error) => {
                    setAuthError(error.message);
                  });
            })
            .catch((error) => {
                setAuthError(error.message);
                console.log(error);
            })
            .finally(() => setIsLoading(false));
    }

    // Save To the Database
    const saveUser=(email, displayName, method)=>{
            const user={email, displayName};
            fetch('http://localhost:5000/users',{
                method:method,
                headers:{ 
                    'content-type':'application/json'
                },
                body:JSON.stringify(user)
            }).then()

    }

//     // For google Sign in

//     const saveGoogleUser=(email, displayName)=>{
//         const user={email, displayName};
//         fetch('http://localhost:5000/users',{
//             method:'PUT',
//             headers:{ 
//                 'content-type':'application/json'
//             },
//             body:JSON.stringify(user)
//         }).then()

// }
    const loginUser = (email, password, location, history) => {
        setIsLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const destination = location?.state?.from || '/';
                history.replace(destination);
                setAuthError('');
            })
            .catch((error) => {
                setAuthError(error.message);
            })
            .finally(() => setIsLoading(false));
    }
    // Google Sign in
    const signInWithGoogle=(location,history)=>{
        setIsLoading(true);
        signInWithPopup(auth, googleProvider)
  .then((result) => {
    
    const user = result.user;
    saveUser(user.email,user.displayName,'PUT');
   
  
  }).catch((error) => {
    setAuthError(error.message);
  })
  .finally(() => setIsLoading(false));
    } 

    // observer user state
    useEffect(() => {
        const unsubscribed = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                getIdToken(user).then(idToken=>{setToken(idToken);})
            } else {
                setUser({})
            }
            setIsLoading(false);
        });
        return () => unsubscribed;
    }, [auth])

    // Single sign initializeFirebase


    const logout = () => {
        setIsLoading(true);
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        })
        .finally(() => setIsLoading(false));
    }

    return {
        user,
        isLoading,
        authError,
        registerUser,
        loginUser,
        logout,
        signInWithGoogle,
        admin,
        token

    }
}

export default useFirebase;