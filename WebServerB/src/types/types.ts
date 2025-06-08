const TYPES = {
    PetController: Symbol.for("PetController"),
    
    ICreatePetUseCase: Symbol.for("ICreatePetUseCase"),
    Repository: Symbol.for("Repository"),
    IQueueFactory: Symbol.for("IQueueFactory"),
    DataSource: Symbol.for("DataSource"),
    IGetPetByIdUseCase: Symbol.for("IGetPetByIdUseCase"),
    PetCreatedQueue: Symbol.for("PetCreatedQueue"),
    QueueFactory: Symbol.for("QueueFactory"),
    PetCreatedSubscriber: Symbol.for("PetCreatedSubscriber"),
    GetAllPetsUseCase: Symbol.for("GetAllPetsUseCase"),
};

export default TYPES;
