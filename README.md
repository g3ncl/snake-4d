# Snake 4D

This is a 4D version of the classic game Snake, built with Next.js and Three.js. This project is heavily inspired by Pella86 [Snake4d](https://github.com/Pella86/Snake4d).

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/g3ncl/snake-4d.git
```

Then, install the dependencies:

```bash
cd snake-4d
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to play the game.

## Game Interface

The game UI is divided into three main sections:

1. A representation of the 4D view
2. A representation of the XY axis
3. A representation of the ZW axis

This layout allows players to visualize the snake's movement across all four dimensions.

## Controls

### Desktop

- Use WASD keys to control movement in the XY plane
- Use IJKL keys to control movement in the ZW plane

### Mobile

- Two touch areas or D-pads are available for controlling movement (selectable from the menu)
- The left area/D-pad controls movement in the XY plane
- The right area/D-pad controls movement in the ZW plane

### Settings

In the game menu, you can:

- Choose between touch areas or D-pads for mobile controls
- Adjust the rotation angles of the 4D view

## Playing in Telegram

You can also play the game in Telegram using the [Snake 4D Telegram Bot](https://github.com/g3ncl/snake-4d-telegram-bot), which uses the Telegram Bot Game API to set per-chat high scores.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
