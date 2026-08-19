import {createRouter, createWebHistory} from "vue-router";
import Login from './pages/Login.vue'
import GestorServicos from './components/GestorServicos.vue'
import Servicos from './pages/Servicos.vue'
import Perfil from './pages/Perfil.vue'
import { LoginStore } from "./store/LoginStore.js";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Login},

        { path: '/servico/:id', redirect: to => `/servico/${to.params.id}/infServico`},
        { path: '/servico/:id/', redirect: to => `/servico/${to.params.id}/infServico`},
        { path: '/servico/:id/infServico', component: GestorServicos},
        { path: '/servico/:id/infVeiculo', component: GestorServicos},
        { path: '/servico/:id/infCliente', component: GestorServicos},

        { path: '/servicos', redirect: '/servicos/agendados'},
        { path: '/servicos/', redirect: '/servicos/agendados'},
        { path: '/servicos/agendados', component: Servicos},
        { path: '/servicos/fila', component: Servicos},
        { path: '/servicos/suspensos', component: Servicos},

        { path: '/perfil', redirect: '/perfil/infPessoais' },
        { path: '/perfil/', redirect: '/perfil/infPessoais' }, //É necessário aceitar todos os casos que apresentem / no fim ?
        { path: '/perfil/infPessoais', component: Perfil},
        { path: '/perfil/servRealizados', component: Perfil},

        { path: '/:notFound(.*)', redirect: '/servicos/agendados'}
    ]
});


router.beforeEach((to, from, next) => {
    try {
        var user = LoginStore()
        if (to.path !== '/' && user.getIdUtilizador==null) {
            next('/');
        } else {
            next();
        }
    }
    catch{
        next('/');
    }
});

export default router;