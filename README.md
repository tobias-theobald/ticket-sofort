# TicketSofort

TicketSofort is a mobile application designed for displaying tickets bought from some German public transport companies, specifically TickEOS (currently only SaarVV). The app allows users to display their tickets immediately upon opening the app without having to do any additional steps (after first logging in once) and supports displaying the security features of the ticket.

## Features

- Display ticket immediately after opening the app.
- Show security features of the ticket.
- Should in theory support all TickEOS-based public transport associations, but currently only SaarVV is supported.
- Supports both iOS and Android platforms.
- Built using React Native and Expo.
- Utilizes Expo's EAS build service for creating builds.

## Installation

To get started with the development of this app, follow these steps:

1. **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd ticketsofort
    ```

2. **Install dependencies:**
    ```sh
    bun install
    ```

3. **Start the development server:**
    ```sh
    bun start
    ```
   
This will start the Expo development server and open the app in the Expo Go app for your platform.

## Building the App

TicketSofort uses Expo's EAS build service to create builds for both iOS and Android. To build the app, follow these steps:

1. **Login to Expo:**
    ```sh
    eas login
    ```

2. **Configure the build:**
    Ensure that the `eas.json` file is correctly configured for your build environment.

3. **Run the build:**
    ```sh
    eas build --platform <ios|android>
    ```

## Project Structure

- `app.json`: Configuration file for the app.
- `eas.json`: Configuration file for EAS build service.
- `assets/`: Directory containing images and other assets.
- `src/`: Directory containing the source code of the app.
  - `components/`: Directory containing React components.
  - `app/`: Directory containing the expo-router entrypoints
  - `constants/`: Directory containing constants used throughout the app.
  - `services/`: Directory containing services used throughout the app.
  - `utils/`: Directory containing utility functions.
  - `types.ts`: Typescript and Zod types used throughout the app.

## To-Do

### MVP
- [x] Data-saving refresh mechanism. Don't load the whole ticket if it's already loaded, etc.
- [x] Tap to set brightness to 100%
- [x] Multi-language support

### Post-MVP
- [ ] Implement settings encryption and (optionally) user authentication.
- [ ] Add support for more public transport companies.
- [ ] Add unit and integration tests. lol.
- [ ] Web support. Would have to proxy requests through a server to avoid CORS issues. Not sure about this one.

## Non-Goals

- Purchasing tickets through the app or route-finding. The DB app is very good at those things.

## Known Issues

### `expo doctor` reports issues with dependency versions

We are using a prerelease version of `expo-sensors` to avoid having to ask for the "Motion" permission on iOS which we don't need but a fix for which is only just being tested.

### Upside-down portrait mode on iOS will show wrong gyro logo location

The problem is that expo-screen-orientation doesn't correctly report the upside down portrait orientation on iOS. This has been a [known issue in the library](https://github.com/expo/expo/issues/10944) but I doubt it will be addressed very soon. If there is a workaround, I'd be happy to hear it. But since this likely only affects iPad users and I have never actually had to prove the functioning of the gyro logo, I'm not too worried about it.   

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Contact

For any inquiries or support, please open a GitHub issue