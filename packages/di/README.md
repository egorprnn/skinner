# API

Пример совокупного использования всех сущностей можно посмотреть тут: `./playground/src`

## Компоненты

### ChildDIProvider

#### Для чего нужен

Используется для изолирования инстансов сервисов между разными частями приложения.
Создаёт дочерний DI контейнер.

#### Как использовать

Базовое использование с именем контейнера

```tsx
<ChildDIProvider name='app'>{children}</ChildDIProvider>
```

Если вам требуется полностью изолированная часть приложения со своими глобальными сервисами или плагинами (например для SSR),
то можно воспользоваться флагом `isolated`.

```tsx
<ChildDIProvider name="app" isolated>{children}</ChildDIProvider>
```

## Декораторы

### Что декорировать

#### @scope.transient()

Классы, которые должны лежать в области представления. Реализуют бизнес-логику конкретного представления.
Модели могут иметь несколько экземпляров в приложении, при этом экземпляров может быть несколько на один контейнер.
Примеры: DocsPageModel, UserWidgetModel

#### @scope.container()

Классы, лежащие в доменной области и реиспользуемые между разными View и другими сервисами.
Сервисы могут иметь несколько экземпляров в приложении, при этом на каждый контейнер будет единственный уникальный экземпляр.
Примеры: DocsItemsService

#### @scope.global()

Классы, которые должны лежать в доменной области или в области плагинов.
Глобальные сервисы могут иметь лишь один экземпляр на всё приложение на клиенте
или на один запрос пользователя, если это сервер.
Стоит избегать использования глобальных сервисов и использовать вместо них @scope.container().
Примеры: UserService, ApiPlugin

#### @scope.platform()

Классы, которые должны лежать в области плагинов и не должны содержать бизнес-логику.
Платформенные плагины могут иметь лишь один экземпляр на всё приложение как на сервере, так и на клиенте
Примеры: LangPlugin

### Как использовать

Все декораторы используются стандартным образом

```ts
@scope.container()
class ExampleService {
}
```

При этом у вас будет возможность получить экземпляр нужного класса в другом классе,
указав тип нужного класса в конструкторе _(запрашиваемый класс должен быть тоже декорирован)_.

```tsx
@scope.container()
class UserService {
  public constructor() {
  }

  name = 'Иван'
}

@scope.transient()
class UserViewModel {
  public constructor(private userService: UserService) {
  }

  get name() {
    return this.userService.name;
  }
}
```

Если в конструкторе будут указаны одинаковые зависимости, но записываемые в разные поля объектов,
то в обоих полях будет один и тот же экземпляр.

```tsx
@scope.container()
class UserService {
  public constructor() {
  }

  name = 'Иван'
}

@scope.transient()
class UserViewModel {
  public constructor(private userService1: UserService, private userService2: UserService) {
    // userService1 === userService2
  }

  get name() {
    return this.userService.name;
  }
}
```

## Функции

### createProvider

#### Для чего нужна

Функция предоставляет возможность создать провайдер для модели и связать его с DI.

#### Как использовать

```tsx
import { init, destroy } from "@vkontakte-internal/di";

@scope.transient()
class UserViewModel {
  public constructor(private userService: UserService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  id: string = 'foo';

  public get name() {
    return this.userService.user.name;
  }

  // будет вызван в момент маунта провайдера
  public [init](props: { id: string }) {
    console.log("init UserViewModel");
  }

  // будет вызван после размауна провайдера
  public [destroy]() {
    console.log("dispose UserViewModel");
  }
}

const {
  Provider: UserViewModelProvider,
  useModel: useUserViewModel,
} = createProvider(UserViewModel);

const UserView = () => {
  const model = useUserViewModel();

  return <div>{model.name}</div>
}

const UserWidget = () => (
  <UserViewModelProvider>
    <UserView/>
  </UserViewModelProvider>
)
```

### createPageProvider

#### Для чего нужна

Функция предоставляет возможность создать провайдер для модели страницы и связать его с DI.
Поведение схоже с функцией `createProvider`.

При этом будет создан новый DI контейнер для изоляции области видимости и для возможности очистки памяти,
после размаунта провайдера.

#### Как использовать

```tsx
@scope.transient()
class DocsPageViewModel {
  public constructor(private userService: UserService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

const {
  Provider: DocsPageViewModelProvider,
  useModel: useDocsPageViewModel,
} = createPageProvider(DocsPageViewModel);

const UserView = () => {
  const model = useUserViewModel();

  return <div>{model.name}</div>
}

const DocsPage = () => (
  <DocsPageViewModelProvider>
    <UserView/>
  </DocsPageViewModelProvider>
)
```

### createWidget

#### Для чего нужен

Упрощает связывание провайдера и View

#### Как использовать

```tsx
@scope.transient()
class UserViewModel {
  /* ... */
}

const {
  Provider: UserViewModelProvider,
  useModel: useUserViewModel,
} = createProvider(UserViewModel);

const UserView = () => {
  const model = useUserViewModel();

  return <div>{model.name}</div>
}

const UserWidget = createWidget(UserViewModelProvider, UserView);
```

## Символы

В каждой сущности присутствует возможность использовать определённые символы,
для управления жизненным циклом класса

### init

Может быть асинхронным и будет вызван в момент маунта виджета, где используется VM.
Помимо этого, init получит пропсы, переданные в виджет.
Здесь лучше всего создавать реакции.

#### Где использовать

ViewModel

#### Как использовать

```tsx
@scope.transient()
class UserViewModel {
  name = '';
  id: string;

  public async [init](props: { id: string }) {
    console.log("init UserViewModel");
    this.id = props.id;
    this.name = await api.getUser(props.id);
  }
}

const {
  Provider: UserViewModelProvider,
  useModel: useUserViewModel,
} = createProvider(UserViewModel);

const UserView = () => {
  const model = useUserViewModel();

  return <div>{model.name}</div>
}

const UserWidget = createWidget(UserViewModelProvider, UserView);

const App = () => <UserWidget id='foobar'/> // id попадёт в init метод
```

### update

Вызывается только при обновлении пропсов виджета уже после первого рендера.

#### Где использовать

ViewModel

#### Как использовать

```tsx
@scope.transient()
class UserViewModel {
  id: string;

  public [update](props: { id: string }) {
    this.id = props.id;
  }
}

const {
  Provider: UserViewModelProvider,
  useModel: useUserViewModel,
} = createProvider(UserViewModel);

const UserView = () => {
  const model = useUserViewModel();

  return <div>{model.name}</div>
}

const UserWidget = createWidget(UserViewModelProvider, UserView);

const App = () => {
  const [id, setId] = useState(0);

  // { id: 123 } попадёт в update метод после клика
  return (
    <>
      <div onClick={() => setId(123)}/>
      <UserWidget id={id}/>
    </>
  )
}
```

### destroy

Будет вызван в момент размаунта виджета для VM и в момент, удаления соответствующего контейнера для сервисов.
В этом месте лучше всего делать отписки у реакций.

#### Где использовать

Доступен к использованию во всех декорированных сущностях.

#### Как использовать

```ts
@scope.transient()
class UserViewModel {
  public [destroy]() {
    console.log("destroy UserViewModel");
  }
}
```

# Низкоуровневое API

Нижеописанные сущности стоит использовать только в том случае, если вы полностью понимаете, что делаете и для чего это
нужно.

## rootContainer

Синглтон, который является корневым DI контейнером. Его можно использовать для порождения дочерних контейнеров в случае,
если вы собираетесь поставлять их потребителям через `DIProvider`.

## DIProvider

Нужен для ручного проброса контейнера потребителям.

**ВАЖНО**: В большинстве случаев стоит ограничиться использованием `ChildDIProvider`, т.к. он самостоятельно
контролирует жизненный цикл контейнера.
При использовании `DIProvider` и ручном создании дочерних контейнеров, есть вероятность породить утечку памяти.

```tsx
import { rootContainer, DIProvider } from "@vkontakte-internal/di";

const childContainer = rootContainer.child();

const Foo = ({ children }) => (
  <DIProvider instance={childContainer}>{children}</DIProvider>
)
```

## DIContainer

Класс, предоставляющий доступ к контейнеру. Нужен для:

- резолва зависимостей
- сериализации/десериализации состояния иерархии контейнеров
- обработки асинхронных задач у инстанцированных сущностей.

Создавать экземпляры класса `DIContainer` в ручную **не нужно**, стоит использовать метод `child` у соответствующего
контейнера - `rootContainer.child('child-container-name')`
