
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect:'/home',
    children: [
      {
        path:'/book',
        name:"book",
        component:()=>import('../pages/Book')

      },
      {
        path:'/bookDescp/:id',
        name:"bookDescp",
        component:()=>import('../pages/BookDescp')

      },
      {
        path:'/rank',
        name:"rank",
        component:()=>import('../pages/Rank')

      },
      {
        path:'/read/:chapterid/:bookid',
        name:"read",
        component:()=>import('../pages/Read')

      },
      {
        path:'/author',
        name:"author",
        component:()=>import('../pages/Author')

      },
      {
        path:'/home',
        name:"home",
        component:()=>import('../pages/Home')

      },
      {
        path:'/shelf',
        name:"shelf",
        component:()=>import('../pages/Shelf')

      },
      {
        path:'/comments/:bookId',
        name:"comments",
        component:()=>import('../pages/Comment')

      },
      {
        path:'/reply',
        name:"reply",
        component:()=>import('../pages/Reply')

      },
      {
        path:'/search',
        name:"search",
        component:()=>import('../pages/Search')

      },
      {
        path:'/author/register',
        name:"register",
        component:()=>import('../pages/Register')

      },
      {
        path:'/error',
        name:"error",
        component:()=>import('../pages/Error')

      }


    ]
  },

  // Always leave this as last one,
  // but you can also remove it
]

export default routes
