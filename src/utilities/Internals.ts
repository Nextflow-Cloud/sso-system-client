class Internals {
    protected flags: Record<string, boolean> = {};

    applyFlag(k: string, v: boolean) {
        this.flags[k] = v;
    }

    fetchFlag(k: string) {
        return this.flags[k];
    }
}

export default Internals;
