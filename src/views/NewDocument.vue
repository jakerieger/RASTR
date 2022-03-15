<template>
    <div class="new-document">
        <Titlebar title="New"/>
        <div class="new-document-container">
            <InputWithLabel label="Name" @textChanged="documentNameChanged"/>
            <div class="dimensions">
                <InputWithLabel label="Width (px)" @textChanged="documentWidthChanged"/>
                <InputWithLabel label="Height (px)" @textChanged="documentHeightChanged"/>
            </div>
            <div class="new-document-footer">
                <button 
                    class="button secondary" 
                    style="margin-right: 10px" 
                    @click="closeWindow"
                >
                Cancel
                </button>
                <button
                    class="button primary"
                    @click="createDocument"
                >
                Create
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ipcRenderer, remote } from 'electron';
import Titlebar from '@/components/Titlebar.vue';
import InputWithLabel from '@/components/InputWithLabel.vue';

export default {
    name: 'NewDocument',
    components: {
        Titlebar,
        InputWithLabel
    },
    data: () => ({
        documentName: '',
        documentWidth: 0,
        documentHeight: 0
    }),
    beforeCreate() {
        document.title = 'New Document'
    },
    methods: {
        documentNameChanged(value) {
            this.documentName = value;
        },
        documentWidthChanged(value) {
            this.documentWidth = parseInt(value);
        },
        documentHeightChanged(value) {
            this.documentHeight = parseInt(value);
        },
        closeWindow() {
            remote.getCurrentWindow().close();
        },
        createDocument() {
            ipcRenderer.send('create-document', {
                name: this.documentName,
                width: this.documentWidth,
                height: this.documentHeight
            });

            remote.getCurrentWindow().close();
        }
    }
}
</script>

<style>
/* .new-document {
    background: #0d0e14;
} */

.new-document-container {
    padding-top: 42px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.dimensions {
    display: flex;
    flex-direction: row;
    flex: 1;
}

.new-document-footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}
</style>