# Equipo Basket - Producto 4: Recibiendo notificaciones push

Este repositorio contiene los proyectos base para el producto 4, en la que se implementan **notificaciones push** usando **Firebase Cloud Messaging** y **Cloud Functions**. Se reutilizan las prácticas anteriores:

- `angular` → Producto 2 (Angular 20)
- `react-native-expo` → Producto 3 (React Native Expo)

---

## Estructura del repositorio

```
/equipo-basket
│
├─ angular/               # Proyecto Angular 20
├─ react-native-expo/     # Proyecto React Native Expo
└─ README.md
```

---

## Requisitos

- Node.js >= 18
- npm o yarn
- Angular CLI (para el proyecto Angular)
- Expo CLI (para el proyecto React Native)
- Cuenta de Firebase con Cloud Messaging y Cloud Functions habilitadas

---

## Instalación

### Angular

```bash
cd angular
npm install   # o yarn install
```

### React Native Expo

```bash
cd react-native-expo
npm install   # o yarn install
```

> Nota: No se incluyen los directorios `node_modules`, ya que se deben generar localmente.

---

## Uso

### Angular

1. Configurar Firebase y agregar `firebase-messaging-sw.js`.
2. Configurar variables de entorno necesarias.
3. Ejecutar el proyecto:

```bash
ng serve
```

---

### React Native Expo

1. Configurar Firebase o Expo Push Notifications.
2. Obtener el token de dispositivo.
3. Ejecutar el proyecto:

```bash
expo start
```

---

## Cloud Functions

- Crear las funciones necesarias para enviar notificaciones push desde Firebase.
- Asegurarse de no subir credenciales (`serviceAccountKey.json`) al repositorio.

---

## Ramas recomendadas

- `main` → Código estable
- `angular-fcm` → Desarrollo de notificaciones push en Angular
- `rn-fcm` → Desarrollo de notificaciones push en React Native
