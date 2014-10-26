declare var testes:{
    success:any;
    error:(error:any)=>void;
    unauthorized:(unauthorized:any)=>void;
    users:{
        list:()=>void;
    };
    articles:{
        create:()=>void;
        getService:()=>any;
        alterLast:(order:number)=>void;
        list:()=>void;
        delete:(orders:any)=>void;
    }
    upload:()=>void;
    loadClientPhotoToken:(callback)=>void;
};