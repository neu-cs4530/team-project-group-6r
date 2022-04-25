import React, { useState } from "react";
import { VStack, Select, Image } from '@chakra-ui/react';
import { PostSkin, postSkinPngMap } from '../../../classes/Image';

interface SelectPostSkinProps {
    setPostSkin: (postSkin: PostSkin) => void;
    postSkin: PostSkin;
}

type SelectPostSkinStates = {
    postSkin: PostSkin;
}

export default function SelectPostSkin({ setPostSkin, postSkin }: SelectPostSkinProps): JSX.Element {
    const [state, setState] = useState<SelectPostSkinStates>({
        postSkin: postSkin || PostSkin.POST,
    });

    const handleSelectPostSkin = (skin: string) => {
        const selectedPostSkin: PostSkin = skin as PostSkin;
        setState({ postSkin: selectedPostSkin });
        setPostSkin(selectedPostSkin);
    };

    const skinSelect = () => (
        <Select size='sm' bg='cyan.10' borderColor='gray' onChange={({ target }) => handleSelectPostSkin(target.value)} placeholder='Select Post Skin'>
            {Object.keys(postSkinPngMap).map((key: string) => <option key={key} value={key}>{key}</option>)}
        </Select>
    );

    return (
        <VStack bg='gray.100' padding='8px' borderRadius='5px' align='center' width="100%" spacing='5px'>
            <Image
                boxSize='50px'
                src={postSkinPngMap[state.postSkin]}
            />
            {skinSelect()}
        </VStack>
    )
}