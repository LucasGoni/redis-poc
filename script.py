import subprocess
import platform

def run_command_in_terminal(command):
    if platform.system() == "Windows":
        subprocess.Popen(["cmd.exe", "/c", "start", "cmd.exe", "/k", command], shell=True)
    else:
        subprocess.Popen(["x-terminal-emulator", "-e", "bash", "-c", command])

if __name__ == "__main__":
    # Commands to run in separate terminals
    frontend_command = "cd backend && npm run serve"
    backend_command = "cd vue-frontend && npm run dev"
    redis_command = "wsl redis-server"

    # Run each command in a separate terminal
    run_command_in_terminal(frontend_command)
    run_command_in_terminal(backend_command)
    run_command_in_terminal(redis_command)
