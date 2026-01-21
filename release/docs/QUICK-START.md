# RTDCS Quick Start Guide

**One-page reference for building and running RTDCS**

---

## Linux (Ubuntu/Debian)

### 1. Install Dependencies
```bash
sudo apt-get update
sudo apt-get install -y build-essential libthrift-dev libgtest-dev
```

### 2. Clone and Build
```bash
git clone https://github.com/meenusinha/BigProjPOC.git
cd BigProjPOC
git checkout claude/continue-planned-tasks-zg6I5

make -C BigModuleA build
make -C BigModuleB build
make -C BigModuleC build
```

### 3. Run (3 terminals)
```bash
# Terminal 1
./BigModuleA/build/release/BigModuleA --pattern sine --samples 100

# Terminal 2
./BigModuleC/build/release/BigModuleC --port 9090

# Terminal 3
./BigModuleB/build/release/BigModuleB --host localhost --port 9090 --samples 50
```

---

## macOS

### 1. Install Dependencies
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Thrift, GoogleTest, and Boost
brew install thrift googletest boost
```

### 2. Clone and Build
```bash
git clone https://github.com/meenusinha/BigProjPOC.git
cd BigProjPOC
git checkout claude/continue-planned-tasks-zg6I5

make -C BigModuleA build
make -C BigModuleB build
make -C BigModuleC build
```

### 3. Run (3 terminals)
```bash
# Terminal 1
./BigModuleA/build/release/BigModuleA --pattern sine --samples 100

# Terminal 2
./BigModuleC/build/release/BigModuleC --port 9090

# Terminal 3
./BigModuleB/build/release/BigModuleB --host localhost --port 9090 --samples 50
```

---

## Quick Commands

### Build
```bash
make -C BigModuleA build    # Build BigModuleA
make -C BigModuleB build    # Build BigModuleB
make -C BigModuleC build    # Build BigModuleC
```

### Clean
```bash
make -C BigModuleA clean    # Clean BigModuleA
make -C BigModuleB clean    # Clean BigModuleB
make -C BigModuleC clean    # Clean BigModuleC
```

### Help
```bash
./BigModuleA/build/release/BigModuleA --help
./BigModuleB/build/release/BigModuleB --help
./BigModuleC/build/release/BigModuleC --help
```

---

## Startup Order

⚠️ **IMPORTANT**: Start in this order:
1. BigModuleA (creates shared memory)
2. BigModuleC (starts RPC server)
3. BigModuleB (connects to both)

---

## Common Options

### BigModuleA
```bash
--pattern sine|step    # Temperature pattern
--samples 100          # Number of samples
--base-temp 25.0       # Base temperature (°C)
```

### BigModuleB
```bash
--host localhost       # BigModuleC hostname
--port 9090           # BigModuleC port
--samples 50          # Number of samples
```

### BigModuleC
```bash
--port 9090           # RPC server port
```

---

## Troubleshooting

### "thrift: command not found"
```bash
# Linux
sudo apt-get install libthrift-dev

# macOS
brew install thrift
```

### "Failed to open shared memory"
```bash
# Start BigModuleA first
./BigModuleA/build/release/BigModuleA --samples 100
```

### "Failed to connect to BigModuleC"
```bash
# Start BigModuleC first
./BigModuleC/build/release/BigModuleC --port 9090
```

### "Address already in use"
```bash
# Use different port
./BigModuleC/build/release/BigModuleC --port 9091
./BigModuleB/build/release/BigModuleB --port 9091
```

---

**See RTDCS-User-Guide.md for complete documentation**
