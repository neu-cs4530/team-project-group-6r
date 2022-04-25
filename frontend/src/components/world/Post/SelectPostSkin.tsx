import React, { useState } from "react";
import { VStack, Select, Image } from '@chakra-ui/react';
import { PostSkin, postNameMap, postSkinMap } from '../../../classes/Image';

interface SelectPostSkinProps {
    setPostSkin: (postSkin: PostSkin) => void;
    postSkin: PostSkin;
}

type SelectPostSkinStates = {
    skin: string;
}

export default function SelectPostSkin({ setPostSkin, postSkin }: SelectPostSkinProps): JSX.Element {
    const [state, setState] = useState<SelectPostSkinStates>({
        skin: postSkinMap[postSkin] || 'Post',
    });

    const handleSelectPostSkin = (skin: string) => {
        setState({ skin });
        setPostSkin(postNameMap[skin].num);
    };

    const skinSelect = () => (
        <Select size='sm' bg='cyan.10' borderColor='gray' onChange={({ target }) => handleSelectPostSkin(target.value)} placeholder='Select Post Skin'>
            {Object.keys(postNameMap).map((key: string) => <option key={key} value={key}>{key}</option>)}
        </Select>
    );

    return (
        <VStack bg='gray.100' padding='8px' borderRadius='5px' align='center' width="100%" spacing='5px'>
            <Image
                boxSize='50px'
                objectFit='cover'
                src={postNameMap[state.skin].png}
            />
            {skinSelect()}
        </VStack>
    )
}