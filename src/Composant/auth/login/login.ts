import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

import {
  Router,
  RouterLink
} from '@angular/router';

import { ThemeService } from '../../../../Backend/Services/theme.service';

import { Icon } from '../../Share/icon/icon';
import { Theme } from '../../Share/Page-Header/theme/theme';



@Component({
  selector: 'app-login',
  standalone:true,

  imports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink,
    Theme,
    Icon
  ],

  templateUrl:'./login.html',
  styleUrls:['./login.css']
})


export class Login implements OnInit {


  loginForm!:FormGroup;


  email='';
  password='';


  showPassword=false;

  isHovered=false;

  isLoading=false;


  message:string|null=null;

  messageType:
  'success' |
  'error' |
  null = null;



  constructor(

    private fb:FormBuilder,

    private http:HttpClient,

    private router:Router,

    public themeService:ThemeService

  ){



    console.log(
      "🚀 CONSTRUCTEUR LOGIN INITIALISE"
    );


  }




  ngOnInit():void{


    console.log(
      "🔵 INITIALISATION LOGIN"
    );



    this.loginForm=this.fb.group({


      email:[

        '',

        [

          Validators.required,

          Validators.email

        ]

      ],



      password:[

        '',

        [

          Validators.required,

          Validators.minLength(6)

        ]

      ]



    });



    console.log(
      "📋 Formulaire créé :",
      this.loginForm
    );



  }








  // ==================================================
  // 🔐 CONNEXION
  // ==================================================


  onSubmit():void{



    console.log(
      "================================"
    );

    console.log(
      "🔐 DEBUT CONNEXION"
    );

    console.log(
      "================================"
    );




    this.message=null;

    this.messageType=null;




    console.log(
      "📋 Etat formulaire :",
      this.loginForm
    );



    console.log(
      "📋 Valeurs envoyées :",
      this.loginForm.value
    );




    if(this.loginForm.invalid){


      console.error(
        "❌ FORMULAIRE INVALIDE"
      );


      console.log(
        "Erreurs formulaire :",
        this.loginForm.errors
      );



      Object.keys(
        this.loginForm.controls
      ).forEach(control=>{


        console.log(

          control,

          this.loginForm.get(control)?.errors

        );


      });




      this.messageType='error';


      this.message =
      "Veuillez remplir correctement tous les champs";



      this.loginForm.markAllAsTouched();


      return;

    }






    this.isLoading=true;



    const loginData={

      email:
      this.loginForm.value.email,


      password:
      this.loginForm.value.password

    };




    console.log(
      "📤 DONNEES ENVOYEES AU BACKEND :",
      loginData
    );




    console.log(
      "🌍 URL API :",
      "http://localhost:3000/api/auth/login"
    );







    this.http.post<any>(

      'http://localhost:3000/api/auth/login',

      loginData

    )



    .subscribe({





      next:(res)=>{


        console.log(
          "================================"
        );

        console.log(
          "✅ REPONSE SERVEUR LOGIN"
        );

        console.log(
          res
        );

        console.log(
          "================================"
        );




        this.isLoading=false;




        if(!res){


          console.error(
            "❌ Réponse vide"
          );


          this.messageType='error';

          this.message =
          "Réponse serveur invalide";


          return;


        }





        console.log(
          "🎟️ TOKEN reçu :",
          res.token
        );



        console.log(
          "👤 USER reçu :",
          res.user
        );






        if(
          !res.token ||
          !res.user
        ){



          console.error(
            "❌ Token ou utilisateur manquant"
          );



          this.messageType='error';


          this.message =
          "Erreur inattendue lors de la connexion";


          return;


        }






        const utilisateur={



          key:
          res.user.key,



          nom:
          res.user.nom,



          prenom:
          res.user.prenom,



          email:
          res.user.email,



          role:
          res.user.role,



          equipe:
          res.user.equipe,



          status:
          res.user.status,



          cookie:
          res.user.cookie || '',



          contact:

          Array.isArray(
            res.user.contact
          )

          ?

          res.user.contact

          :

          [

            res.user.contact

          ]



        };




        console.log(
          "💾 UTILISATEUR STOCKE :",
          utilisateur
        );






        localStorage.setItem(

          'token',

          res.token

        );




        console.log(
          "💾 TOKEN LOCALSTORAGE OK"
        );




        localStorage.setItem(

          'utilisateur',

          JSON.stringify(utilisateur)

        );




        console.log(
          "💾 USER LOCALSTORAGE OK"
        );



        console.log(
          "LOCALSTORAGE TOKEN :",
          localStorage.getItem('token')
        );


        console.log(
          "LOCALSTORAGE USER :",
          localStorage.getItem('utilisateur')
        );





        this.messageType='success';


        this.message =
        "Connexion réussie";



        this.loginForm.reset();



        setTimeout(()=>{


          console.log(
            "➡️ Redirection accueil"
          );



          this.router.navigate([
            '/accueil'
          ]);


        },1000);



      },





      error:(err)=>{


        console.error(
          "================================"
        );


        console.error(
          "❌ ERREUR LOGIN"
        );


        console.error(
          err
        );


        console.error(
          "STATUS :",
          err.status
        );


        console.error(
          "MESSAGE :",
          err.message
        );


        console.error(
          "BODY BACKEND :",
          err.error
        );


        console.error(
          "================================"
        );




        this.isLoading=false;



        this.messageType='error';




        if(err.status===404){


          this.message =
          "Utilisateur introuvable";


        }

        else if(err.status===401){


          this.message =
          "Email ou mot de passe incorrect";


        }

        else if(err.status===0){


          this.message =
          "Serveur inaccessible";


        }

        else{


          this.message =
          err.error?.message ||

          "Erreur connexion";


        }



      }



    });


  }








  // ==================================================
  // 👁 PASSWORD
  // ==================================================


  togglePassword():void{


    this.showPassword =
    !this.showPassword;



    console.log(
      "👁 Affichage password :",
      this.showPassword
    );


  }








  // ==================================================
  // 🌙 THEME
  // ==================================================


  toggleTheme():void{


    console.log(
      "🌙 Changement thème"
    );


    this.themeService.toggleTheme();


  }



  get isDarkMode():boolean{


    return this.themeService.isDarkMode;


  }








  // ==================================================
  // GOOGLE
  // ==================================================


  loginWithGoogle():void{


    console.log(
      "🔵 LOGIN GOOGLE"
    );


    window.location.href =
    'http://localhost:3000/api/auth/google';


  }




  // ==================================================
  // FACEBOOK
  // ==================================================


  loginWithFacebook():void{


    console.log(
      "🔵 LOGIN FACEBOOK"
    );


    window.location.href =
    'http://localhost:3000/api/auth/facebook';


  }








  // ==================================================
  // 🎨 COLOR
  // ==================================================


  darkenColor(

    color:string,

    amount:number

  ):string{


    console.log(
      "🎨 Darken color",
      color,
      amount
    );



    color =
    color.replace('#','');



    const num =
    parseInt(color,16);



    let r =
    (num >> 16)-amount;


    let g =
    ((num >> 8)&255)-amount;


    let b =
    (num&255)-amount;



    r=Math.max(r,0);

    g=Math.max(g,0);

    b=Math.max(b,0);



    const result =
    `#${(

      (r<<16) |

      (g<<8) |

      b

    )

    .toString(16)

    .padStart(6,'0')}`;




    console.log(
      "🎨 Résultat couleur :",
      result
    );


    return result;


  }



}